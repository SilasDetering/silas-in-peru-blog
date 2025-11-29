import { Component } from '@angular/core';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  // neue Struktur: sections mit subfolders
  sections: {
    name: string;
    subfolders: { name: string; images: { filename: string; url: string; comment?: string; type: 'image'|'video'; poster?: string }[] }[];
  }[] = [];

  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_FOLDER = 'Fotos';
  private readonly CDN_SMALL_SUBFOLDER = '800px';

  constructor(private imagesService: ImagesService) {
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
    console.log('Mehr Bilder laden...');
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
