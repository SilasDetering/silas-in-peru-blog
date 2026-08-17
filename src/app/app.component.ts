import { Component, OnInit, OnDestroy, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ImagesService } from './services/images.service';
import { inject } from "@vercel/analytics";
import { SlideshowItem } from './components/gallery/gallery.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'Silas in Peru';
  picture: string = 'colca_canyon.JPG';
  isGalleryPage = false;

  // Modal state
  modalOpen = false;
  modalFolder = '';
  modalImages: { filename: string; comment?: string; type?: 'image'|'video'; url?: string; poster?: string }[] = [];
  modalIndex = 0;
  modalImageUrl = '';
  modalCaption = '';
  isLoading = false;

  // true wenn das aktuell geladene Bild breiter als hoch ist
  isModalImageLandscape = false;

  // neues Feld, um pending timeouts zu verwalten
  private modalImageSetTimeout: any = null;

  // ---- Slideshow State ----
  slideshowOpen = false;
  slideshowItems: SlideshowItem[] = [];
  slideshowIndex = 0;
  slideshowPaused = false;
  slideshowLoading = false;
  slideshowIntervalMs = 5000;
  private slideshowTimer: any = null;
  private ssProgressKey = 0;
  private preloadedUrls = new Set<string>();
  ssControlsVisible = true;
  ssShowCaption = true;                  // Toggle für Bildbeschreibung
  isFullscreen = false;                  // Echter Browser-Vollbildmodus
  private ssIdleTimer: any = null;
  private readonly SS_IDLE_MS = 2500;

  // Computed Slideshow Getters
  get currentSsItem(): SlideshowItem | null {
    return this.slideshowItems[this.slideshowIndex] ?? null;
  }
  get currentSsMonth(): string {
    const item = this.currentSsItem;
    return item ? item.month : '';
  }
  get currentSsLocation(): string {
    const item = this.currentSsItem;
    if (!item || item.kind === 'title') return '';
    return (item as any).location ?? '';
  }
  get currentMediaIndex(): number {
    // Zählt nur Medien-Items bis zum aktuellen Index
    let count = 0;
    for (let i = 0; i <= this.slideshowIndex && i < this.slideshowItems.length; i++) {
      if (this.slideshowItems[i].kind !== 'title') count++;
    }
    return count;
  }
  get totalMediaCount(): number {
    return this.slideshowItems.filter(it => it.kind !== 'title').length;
  }
  get slideshowProgressKey(): number {
    return this.ssProgressKey;
  }
  get slideshowTitleCardDuration(): number {
    return Math.max(2000, this.slideshowIntervalMs / 2);
  }

  // Template-Helfer: liefern das aktuelle Item als spezifischen Typ (oder null)
  get ssImageItem() {
    const item = this.currentSsItem;
    return item?.kind === 'image' ? item : null;
  }
  get ssVideoItem() {
    const item = this.currentSsItem;
    return item?.kind === 'video' ? item : null;
  }
  get ssCurrentComment(): string {
    const item = this.currentSsItem;
    if (item?.kind === 'image' || item?.kind === 'video') return item.comment || '';
    return '';
  }

  private openHandler = (ev: any) => this.handleOpenEvent(ev);
  private openSlideshowHandler = (ev: any) => this.handleOpenSlideshowEvent(ev);

  constructor(private router: Router, private imagesService: ImagesService) {}

  ngOnInit(): void {
    inject();

    this.updateRoute(this.router.url);

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('Navigation event:', event.urlAfterRedirects);
        this.updateRoute(event.urlAfterRedirects);
      });

    window.addEventListener('open-gallery-modal', this.openHandler as EventListener);
    window.addEventListener('open-slideshow', this.openSlideshowHandler as EventListener);
  }

  private updateRoute(url: string): void {
    switch (url) {
      case '/home':
        this.title = 'Blog';
        this.picture = 'colca_canyon.JPG';
        this.isGalleryPage = false;
        break;
      case '/ueber-mich':
        this.title = 'Silas Detering';
        this.picture = 'gruppenfoto_salitas.JPG';
        this.isGalleryPage = false;
        break;
      case '/einsatzort':
        this.title = 'Cashibo';
        this.picture = 'cashibo.png';
        this.isGalleryPage = false;
        break;
      case '/bilder':
        this.title = 'Galerie';
        this.picture = 'IMG_0591.jpeg';
        this.isGalleryPage = true;
        break;
      default:
        this.title = 'Silas in Peru';
        this.picture = 'colca_canyon.JPG';
        this.isGalleryPage = false;
    }
  }

  ngOnDestroy(): void {
    window.removeEventListener('open-gallery-modal', this.openHandler as EventListener);
    window.removeEventListener('open-slideshow', this.openSlideshowHandler as EventListener);
    this.stopSlideshowTimer();
  }

  private handleOpenEvent(ev: any): void {
    const detail = ev?.detail;
    if (!detail) return;
    this.modalFolder = detail.folderName;
    this.modalImages = detail.images || [];
    this.modalIndex = typeof detail.index === 'number' ? detail.index : 0;
    this.isLoading = true;
    this.updateModalForIndex();
    this.modalOpen = true;
  }

  private updateModalForIndex(): void {
    if (!this.modalImages.length) return;
    const current = this.modalImages[this.modalIndex];
    const url = current.url || (current.filename ? this.imagesService.getCdnFullUrl(current.filename) : '');
    this.modalCaption = current.comment || '';
    this.isLoading = true;
    this.isModalImageLandscape = false; // reset until actual size known

    // clear any pending timeout (safety)
    if (this.modalImageSetTimeout) {
      clearTimeout(this.modalImageSetTimeout);
      this.modalImageSetTimeout = null;
    }

    // Force a real reload: remove src then set it asynchronously so the browser fires load
    this.modalImageUrl = '';
    this.modalImageSetTimeout = setTimeout(() => {
      this.modalImageUrl = url;
      this.modalImageSetTimeout = null;
    }, 10);
  }

  closeModal(): void {
    // clear pending timeout to avoid stray image assignments after close
    if (this.modalImageSetTimeout) {
      clearTimeout(this.modalImageSetTimeout);
      this.modalImageSetTimeout = null;
    }
    this.modalOpen = false;
    this.modalImageUrl = '';
    this.modalCaption = '';
    this.isLoading = false;
    this.modalImages = [];
    this.isModalImageLandscape = false;
  }

  prevModal(evt?: Event): void {
    if (evt) evt.stopPropagation();
    if (!this.modalImages.length) return;
    this.modalIndex = (this.modalIndex - 1 + this.modalImages.length) % this.modalImages.length;
    this.updateModalForIndex();
  }

  nextModal(evt?: Event): void {
    if (evt) evt.stopPropagation();
    if (!this.modalImages.length) return;
    this.modalIndex = (this.modalIndex + 1) % this.modalImages.length;
    this.updateModalForIndex();
  }

  dispatchSlideshowTrigger(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(() => {});
    }
    window.dispatchEvent(new CustomEvent('trigger-slideshow'));
  }

  @HostListener('document:fullscreenchange')
  onFullscreenChange(): void {
    this.isFullscreen = !!document.fullscreenElement;
  }

  @HostListener('document:contextmenu', ['$event'])
  onGlobalContextMenu(event: MouseEvent): void {
    const target = event.target as HTMLElement | null;
    if (target) {
      const isMedia = target.matches('img, video, canvas') || !!target.closest('img, video, canvas, .gallery-item, .blog-float-wrap, .image-row, .modal-image-wrap, .signature-row, .gebetsanliegen');
      if (isMedia) {
        event.preventDefault();
      }
    }
  }

  onModalImageLoad(ev: Event): void {
    // set landscape/portrait based on intrinsic image size
    const img = ev?.target as HTMLImageElement | null;
    if (img && img.naturalWidth && img.naturalHeight) {
      this.isModalImageLandscape = img.naturalWidth >= img.naturalHeight;
    } else {
      this.isModalImageLandscape = false;
    }
    this.isLoading = false;
    // preload neighbors (images/videos use URL)
    if (this.modalImages.length) {
      const prev = (this.modalIndex - 1 + this.modalImages.length) % this.modalImages.length;
      const next = (this.modalIndex + 1) % this.modalImages.length;
      [prev, next].forEach(i => {
        const src = this.modalImages[i].url || (this.modalImages[i].filename ? this.imagesService.getCdnFullUrl(this.modalImages[i].filename) : '');
        if (!src) return;
        if ((this.modalImages[i].type || 'image') === 'video') {
          // create a video element to hint the browser to preload metadata
          const v = document.createElement('video');
          v.preload = 'metadata';
          v.src = src;
        } else {
          const im = new Image();
          im.src = src;
        }
      });
    }
  }

  onModalVideoMetadata(ev: Event): void {
    const video = ev?.target as HTMLVideoElement | null;
    if (video && video.videoWidth && video.videoHeight) {
      this.isModalImageLandscape = video.videoWidth >= video.videoHeight;
    } else {
      this.isModalImageLandscape = false;
    }
    this.isLoading = false;
  }

  onModalImageError(): void {
    this.isLoading = false;
    // optional: handle error UI
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    // ---- Slideshow keyboard shortcuts ----
    if (this.slideshowOpen) {
      if (event.key === 'Escape') {
        this.closeSlideshowView();
        event.preventDefault();
      } else if (event.key === 'ArrowLeft') {
        this.prevSlide();
        event.preventDefault();
      } else if (event.key === 'ArrowRight') {
        this.nextSlide();
        event.preventDefault();
      } else if (event.key === ' ') {
        this.toggleSlideshowPause();
        event.preventDefault();
      } else if (event.key === 'f' || event.key === 'F') {
        this.toggleFullscreen();
        event.preventDefault();
      } else if (event.key === 'ArrowUp' || event.key === 'PageUp') {
        this.prevChapter();
        event.preventDefault();
      } else if (event.key === 'ArrowDown' || event.key === 'PageDown') {
        this.nextChapter();
        event.preventDefault();
      }
      return;
    }
    // ---- Normal modal keyboard shortcuts ----
    if (!this.modalOpen) return;
    if (event.key === 'Escape') {
      this.closeModal();
      event.preventDefault();
    } else if (event.key === 'ArrowLeft') {
      this.prevModal();
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.nextModal();
      event.preventDefault();
    }
  }

  // ===== Slideshow Methods =====

  private handleOpenSlideshowEvent(ev: any): void {
    const items: SlideshowItem[] = ev?.detail?.items;
    if (!items || !items.length) return;
    this.slideshowItems = items;
    this.slideshowIndex = 0;
    this.slideshowPaused = false;
    this.slideshowLoading = false;
    this.ssProgressKey = 0;
    this.preloadedUrls.clear();
    this.ssControlsVisible = true;
    this.slideshowOpen = true;
    this.startSlideshowTimer();
    this.preloadNext();
    this.resetIdleTimer();
  }

  closeSlideshowView(): void {
    this.stopSlideshowTimer();
    this.clearIdleTimer();
    if (document.fullscreenElement) {
      document.exitFullscreen?.().catch(() => {});
    }
    this.slideshowOpen = false;
    this.slideshowItems = [];
    this.slideshowIndex = 0;
    this.slideshowPaused = false;
    this.ssControlsVisible = true;
    this.preloadedUrls.clear();
  }

  toggleFullscreen(): void {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen?.().catch(err => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen?.().catch(err => {
        console.warn('Exit fullscreen failed:', err);
      });
    }
  }

  onSlideshowMouseMove(): void {
    if (!this.slideshowOpen) return;
    this.ssControlsVisible = true;
    this.resetIdleTimer();
  }

  private resetIdleTimer(): void {
    this.clearIdleTimer();
    this.ssIdleTimer = setTimeout(() => {
      this.ssControlsVisible = false;
    }, this.SS_IDLE_MS);
  }

  private clearIdleTimer(): void {
    if (this.ssIdleTimer) {
      clearTimeout(this.ssIdleTimer);
      this.ssIdleTimer = null;
    }
  }

  prevSlide(): void {
    if (!this.slideshowItems.length) return;
    this.stopSlideshowTimer();
    this.slideshowIndex = (this.slideshowIndex - 1 + this.slideshowItems.length) % this.slideshowItems.length;
    this.ssProgressKey++;
    if (!this.slideshowPaused) this.startSlideshowTimer();
    this.preloadNext();
  }

  nextSlide(): void {
    if (!this.slideshowItems.length) return;
    this.stopSlideshowTimer();
    this.slideshowIndex = (this.slideshowIndex + 1) % this.slideshowItems.length;
    this.ssProgressKey++;
    if (!this.slideshowPaused) this.startSlideshowTimer();
    this.preloadNext();
  }

  prevChapter(): void {
    if (!this.slideshowItems.length) return;
    this.stopSlideshowTimer();

    // Suche vorheriges Kapitel vor aktuellem Index
    let targetIndex = -1;
    for (let i = this.slideshowIndex - 1; i >= 0; i--) {
      if (this.slideshowItems[i].kind === 'title') {
        targetIndex = i;
        break;
      }
    }

    // Wrap around zum letzten Kapitel
    if (targetIndex === -1) {
      for (let i = this.slideshowItems.length - 1; i >= 0; i--) {
        if (this.slideshowItems[i].kind === 'title') {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex !== -1) {
      this.slideshowIndex = targetIndex;
      this.ssProgressKey++;
      if (!this.slideshowPaused) this.startSlideshowTimer();
      this.preloadNext();
    }
  }

  nextChapter(): void {
    if (!this.slideshowItems.length) return;
    this.stopSlideshowTimer();

    // Suche nächstes Kapitel nach aktuellem Index
    let targetIndex = -1;
    for (let i = this.slideshowIndex + 1; i < this.slideshowItems.length; i++) {
      if (this.slideshowItems[i].kind === 'title') {
        targetIndex = i;
        break;
      }
    }

    // Wrap around zum ersten Kapitel
    if (targetIndex === -1) {
      for (let i = 0; i < this.slideshowItems.length; i++) {
        if (this.slideshowItems[i].kind === 'title') {
          targetIndex = i;
          break;
        }
      }
    }

    if (targetIndex !== -1) {
      this.slideshowIndex = targetIndex;
      this.ssProgressKey++;
      if (!this.slideshowPaused) this.startSlideshowTimer();
      this.preloadNext();
    }
  }

  toggleSlideshowPause(): void {
    this.slideshowPaused = !this.slideshowPaused;
    if (this.slideshowPaused) {
      this.stopSlideshowTimer();
    } else {
      this.startSlideshowTimer();
    }
  }

  onSlideshowVideoEnded(): void {
    // Video ist fertig -> direkt zur nächsten Slide (kein Timer für Videos)
    this.nextSlide();
  }

  onSlideshowVideoLoaded(): void {
    this.slideshowLoading = false;
  }

  onSlideshowLoad(): void {
    this.slideshowLoading = false;
  }

  onIntervalChange(event: Event): void {
    const val = +(event.target as HTMLInputElement).value;
    this.slideshowIntervalMs = val * 1000;
    if (!this.slideshowPaused) {
      this.stopSlideshowTimer();
      this.startSlideshowTimer();
    }
  }

  private startSlideshowTimer(): void {
    this.stopSlideshowTimer();
    const item = this.currentSsItem;
    if (!item) return;
    // Videos werden durch ihr 'ended' Event gesteuert, kein Timer
    if (item.kind === 'video') return;
    const delay = item.kind === 'title' ? this.slideshowTitleCardDuration : this.slideshowIntervalMs;
    this.slideshowTimer = setTimeout(() => {
      this.nextSlide();
    }, delay);
  }

  private stopSlideshowTimer(): void {
    if (this.slideshowTimer) {
      clearTimeout(this.slideshowTimer);
      this.slideshowTimer = null;
    }
  }

  /**
   * Lädt die nächsten n Medien-Items vor (überspringt Titelkarten).
   * Bilder werden als Image-Objekt vorgeladen, Videos nur mit preload="metadata".
   */
  private preloadNext(n = 3): void {
    let loaded = 0;
    let idx = this.slideshowIndex + 1;
    while (loaded < n && idx < this.slideshowItems.length) {
      const item = this.slideshowItems[idx];
      idx++;
      if (item.kind === 'title') continue;
      const url = (item as any).url as string;
      if (!url || this.preloadedUrls.has(url)) { loaded++; continue; }
      this.preloadedUrls.add(url);
      if (item.kind === 'video') {
        const v = document.createElement('video');
        v.preload = 'metadata';
        v.src = url;
      } else {
        const img = new Image();
        img.src = url;
      }
      loaded++;
    }
  }
}
