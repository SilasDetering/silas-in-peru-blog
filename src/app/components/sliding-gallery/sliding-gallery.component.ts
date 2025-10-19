import { Component, OnInit, HostListener } from '@angular/core';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-sliding-gallery',
  templateUrl: './sliding-gallery.component.html',
  styleUrls: ['./sliding-gallery.component.css']
})
export class SlidingGalleryComponent implements OnInit {

  images: { filename: string; url: string; thumbUrl: string; comment?: string }[] = [];
  currentIndex = 0;

  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_FOLDER = 'Fotos';
  private readonly CDN_SMALL_SUBFOLDER = '800px';

  constructor(private imagesService: ImagesService) {
    // ...existing code...
  }

  ngOnInit(): void {
    const raw = this.imagesService.getCashiboImages() || [];
    this.images = raw.map(entry => {
      if (typeof entry === 'string') {
        const filename = (entry.split('/').pop() || entry).trim();
        return {
          filename,
          url: this.toCdnFullUrl(filename),
          thumbUrl: this.toCdnSmallUrl(filename),
          comment: ''
        };
      } else if (entry && typeof entry === 'object') {
        const filename = Object.keys(entry)[0];
        const comment = (entry as any)[filename] || '';
        const fname = (filename.split('/').pop() || filename).trim();
        return {
          filename: fname,
          url: this.toCdnFullUrl(fname),
          thumbUrl: this.toCdnSmallUrl(fname),
          comment
        };
      } else {
        const fallback = String(entry);
        const filename = (fallback.split('/').pop() || fallback).trim();
        return {
          filename,
          url: this.toCdnFullUrl(filename),
          thumbUrl: this.toCdnSmallUrl(filename),
          comment: ''
        };
      }
    });

    // preload first neighbors
    this.preloadNeighborImages();
  }

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent) {
    if (event.key === 'ArrowLeft') {
      this.prev();
      event.preventDefault();
    } else if (event.key === 'ArrowRight') {
      this.next();
      event.preventDefault();
    }
  }

  prev(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
    this.preloadNeighborImages();
  }

  next(): void {
    if (!this.images.length) return;
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
    this.preloadNeighborImages();
  }

  setIndex(i: number): void {
    if (i < 0 || i >= this.images.length) return;
    this.currentIndex = i;
    this.preloadNeighborImages();
  }

  openCurrent(): void {}

  private preloadNeighborImages(): void {
    if (!this.images.length) return;
    const prev = (this.currentIndex - 1 + this.images.length) % this.images.length;
    const next = (this.currentIndex + 1) % this.images.length;
    [prev, next].forEach(i => {
      const src = this.images[i].url;
      const img = new Image();
      img.src = src;
    });
  }

  private toCdnSmallUrl(pathOrName: string): string {
    const filename = (pathOrName.split('/').pop() || pathOrName).trim();
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${this.CDN_SMALL_SUBFOLDER}/${filename}`;
  }

  private toCdnFullUrl(pathOrName: string): string {
    const filename = (pathOrName.split('/').pop() || pathOrName).trim();
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${filename}`;
  }
}
