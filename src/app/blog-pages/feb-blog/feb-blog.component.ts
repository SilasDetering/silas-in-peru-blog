import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-feb-blog',
  templateUrl: './feb-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class FebBlogComponent {

  readonly image1Filename = '';
  readonly image2Filename = '';
  readonly image3Filename = '';
  readonly image4Filename = '';
  readonly image5Filename = '';
  readonly image6Filename = '';

  image1: string = '';
  image2: string = '';
  image3: string = '';
  image4: string = '';
  image5: string = '';
  image6: string = '';

  // Alle Bilder für Modal
  blogImages: { filename: string; comment?: string; type: 'image' | 'video' }[] = [];

  constructor(private sanitizer: DomSanitizer, private imagesService: ImagesService) {
    this.image1 = this.imagesService.getCdnSmallUrl(this.image1Filename);
    this.image2 = this.imagesService.getCdnSmallUrl(this.image2Filename);
    this.image3 = this.imagesService.getCdnSmallUrl(this.image3Filename);
    this.image4 = this.imagesService.getCdnSmallUrl(this.image4Filename);
    this.image5 = this.imagesService.getCdnSmallUrl(this.image5Filename);
    this.image6 = this.imagesService.getCdnSmallUrl(this.image6Filename);

    // Definiere alle Bilder für das Modal
    this.blogImages = [
      { filename: this.image1Filename, type: 'image' },
      { filename: this.image2Filename, type: 'image' },
      { filename: this.image3Filename, type: 'image' },
      { filename: this.image4Filename, type: 'image' },
      { filename: this.image5Filename, type: 'image' },
      { filename: this.image6Filename, type: 'image' }
    ];
  }

  // Öffne Modal mit den Blog-Bildern
  openBlogImageModal(index: number): void {
    const images = this.blogImages.map(img => ({
      filename: img.filename,
      comment: img.comment || '',
      type: img.type,
      url: this.imagesService.getCdnFullUrl(img.filename),
      poster: ''
    }));

    const detail = { sectionName: 'Dezember 2025', folderName: 'Blog', index, images };
    window.dispatchEvent(new CustomEvent('open-gallery-modal', { detail }));
  }
}
