import { Component, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { ImagesService } from '../../services/images.service';

export type SlideshowItem =
  | { kind: 'title'; month: string; location?: string }
  | { kind: 'image'; url: string; filename: string; comment: string; month: string; location: string }
  | { kind: 'video'; url: string; filename: string; comment: string; poster: string; month: string; location: string };

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent implements OnInit, AfterViewInit, OnDestroy {

  private triggerHandler = () => this.startSlideshow();

  sections: {
    name: string;
    subfolders: { name: string; images: { filename: string; url: string; comment?: string; type: 'image'|'video'; poster?: string }[] }[];
  }[] = [];

  visibleCount = 2;
  activeSectionIndex = 0;
  private observer?: IntersectionObserver;

  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_FOLDER = 'Fotos';
  private readonly CDN_SMALL_SUBFOLDER = '800px';

  constructor(private imagesService: ImagesService, private cdr: ChangeDetectorRef) {
    // build nested sections model
    const sectionNames = this.imagesService.getSectionNames();
    this.sections = sectionNames.map(sectionName => {
      const subfolderNames = this.imagesService.getSubfolders(sectionName);
      // Falls keine Subfolders (älteres flaches Format), behandeln wir sectionName als einzelnen "Ordner"
      const subfolders = (subfolderNames.length ? subfolderNames : [sectionName]).map(subName => {
        const entries = subfolderNames.length
          ? this.imagesService.getImagesIn(sectionName, subName)
          : this.imagesService.getImagesIn(sectionName, subName); // fallback - kompatibel
        const images = (entries || []).map((entry: any) => {
          let filename = '';
          let comment = '';
          if (typeof entry === 'string') {
            filename = (entry.split('/').pop() || entry).trim();
          } else if (entry && typeof entry === 'object') {
            const key = Object.keys(entry)[0];
            filename = (key.split('/').pop() || key).trim();
            comment = (entry as any)[key] || '';
          } else {
            const fallback = String(entry);
            filename = (fallback.split('/').pop() || fallback).trim();
          }

          const ext = (filename.split('.').pop() || '').toLowerCase();
          const isVideo = ['mp4','webm','mov'].includes(ext);

          if (isVideo) {
            return {
              filename,
              url: this.imagesService.getCdnFullUrl(filename),
              comment,
              type: 'video' as const,
              poster: this.imagesService.getCdnVideoThumbnailUrl(filename)
            };
          } else {
            return {
              filename,
              url: this.imagesService.getCdnSmallUrl(filename),
              comment,
              type: 'image' as const
            };
          }
        });
        return { name: subName, images };
      });

      return { name: sectionName, subfolders };
    });
  }

  ngOnInit(): void {
    window.addEventListener('trigger-slideshow', this.triggerHandler);
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    window.removeEventListener('trigger-slideshow', this.triggerHandler);
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  openImage(image: any): void {
    // akzeptiert string oder das image-objekt
    let filename = '';
    if (!image) return;
    if (typeof image === 'string') {
      filename = (image.split('/').pop() || image).trim();
    } else if (image.filename) {
      filename = image.filename;
    } else if (image.url) {
      filename = (image.url.split('/').pop() || image.url).trim();
    }

    const fullUrl = `${this.CDN_BASE}/${this.CDN_FOLDER}/${filename}`;
    window.open(fullUrl, '_blank');
    console.log('Bild geöffnet:', fullUrl);
  }

  onLoadMore(): void {
    if (this.visibleCount < this.sections.length) {
      this.visibleCount++;
      this.cdr.detectChanges();
      this.observeElements();
    }
  }

  scrollToSection(index: number): void {
    if (index < 0 || index >= this.sections.length) return;

    this.activeSectionIndex = index;

    if (this.visibleCount <= index) {
      this.visibleCount = index + 1;
      this.cdr.detectChanges();
      this.observeElements();
    }

    setTimeout(() => {
      const element = document.getElementById('gallery-section-' + index);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }

  private initIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const scrollContainer = document.querySelector('.wrapper');

    this.observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const topEntry = visible[0];
        const id = topEntry.target.id;
        const indexStr = id.replace('gallery-section-', '');
        const foundIndex = parseInt(indexStr, 10);
        if (!isNaN(foundIndex) && foundIndex >= 0 && foundIndex < this.sections.length) {
          this.activeSectionIndex = foundIndex;
          this.cdr.detectChanges();
        }
      }
    }, {
      root: scrollContainer,
      threshold: [0.05, 0.2],
      rootMargin: '-40px 0px -50% 0px'
    });

    this.observeElements();
  }

  private observeElements(): void {
    if (!this.observer) return;
    setTimeout(() => {
      this.sections.forEach((_, i) => {
        if (i < this.visibleCount) {
          const el = document.getElementById('gallery-section-' + i);
          if (el) {
            this.observer?.observe(el);
          }
        }
      });
    }, 100);
  }

  startSlideshow(): void {
    const items: SlideshowItem[] = [];

    // Zeiträume umkehren: vom ältesten Monat bis zum neuesten
    const sectionsReversed = [...this.sections].reverse();

    for (const section of sectionsReversed) {
      // Orte umkehren: vom untersten Ort im Monat zum obersten
      const foldersReversed = [...section.subfolders].reverse();

      for (const folder of foldersReversed) {
        // Titelkarte für das Kapitel / den Ort
        items.push({ kind: 'title', month: section.name, location: folder.name });

        // Fotos im Ort von oben nach unten (Originalreihenfolge)
        for (const img of folder.images) {
          if (img.type === 'video') {
            items.push({
              kind: 'video',
              url: this.imagesService.getCdnFullUrl(img.filename),
              filename: img.filename,
              comment: img.comment || '',
              poster: (img as any).poster || '',
              month: section.name,
              location: folder.name
            });
          } else {
            items.push({
              kind: 'image',
              url: this.imagesService.getCdnFullUrl(img.filename),
              filename: img.filename,
              comment: img.comment || '',
              month: section.name,
              location: folder.name
            });
          }
        }
      }
    }

    window.dispatchEvent(new CustomEvent('open-slideshow', { detail: { items } }));
  }

  // Sendet ein CustomEvent ans window, damit die app-root das Modal öffnen kann
  emitOpenModal(sectionName: string, folderName: string, index: number): void {
    // Sende Modal-Detail mit Section (Kapitel), Folder (Location) und Bildern
    console.log('emitOpenModal', sectionName, folderName, index);

    const section = this.sections.find(s => s.name === sectionName);
    if (!section) {
      console.warn('emitOpenModal: Section not found:', sectionName);
      return;
    }

    const folder = section.subfolders.find(f => f.name === folderName);
    if (!folder) {
      console.warn('emitOpenModal: Folder not found in section', sectionName, folderName);
      return;
    }

    // images-Detail für das Modal: nur benötigte Felder (filename, comment, type)
    const images = folder.images.map(img => ({
      filename: img.filename,
      comment: img.comment || '',
      type: img.type,
      // full URL for modal consumption (images/videos)
      url: this.imagesService.getCdnFullUrl(img.filename),
      // poster thumbnail (may be undefined for images)
      poster: (img as any).poster || ''
    }));

    const detail = { sectionName, folderName, index, images };
    window.dispatchEvent(new CustomEvent('open-gallery-modal', { detail }));
  }
}
