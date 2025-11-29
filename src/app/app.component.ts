import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { ImagesService } from './services/images.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {
  title: string = 'Silas in Peru';
  picture: string = 'colca_canyon.JPG';

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

  private openHandler = (ev: any) => this.handleOpenEvent(ev);

  constructor(private router: Router, private imagesService: ImagesService) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('Navigation event:', event.urlAfterRedirects);
        switch (event.urlAfterRedirects) {
          case '/home':
            this.title = 'Blog';
            this.picture = 'colca_canyon.JPG';
            break;
          case '/ueber-mich':
            this.title = 'Silas Detering';
            this.picture = 'gruppenfoto_salitas.JPG';
            break;
          case '/einsatzort':
            this.title = 'Cashibo';
            this.picture = 'cashibo-rainbow.jpeg'
            break;
          case '/bilder':
            this.title = 'Galerie';
            this.picture = 'IMG_0591.jpeg';
            break;
          default:
            this.title = 'Silas in Peru';
            this.picture = 'colca_canyon.JPG';
        }
      });

    window.addEventListener('open-gallery-modal', this.openHandler as EventListener);
  }

  ngOnDestroy(): void {
    window.removeEventListener('open-gallery-modal', this.openHandler as EventListener);
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
}
