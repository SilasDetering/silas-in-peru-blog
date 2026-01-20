import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-dez-blog',
  templateUrl: './dez-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class DezBlogComponent {

  // Bild für das HTML (immer in der HTML festgelegt, hier wird die CDN-URL bereitgestellt)
  readonly image1Filename = 'IMG_2059.jpeg';
  readonly image2Filename = 'IMG_1471.JPG';
  readonly image3Filename = 'B3188E6D-32D6-43AF-BF0A-9E3E144C3747.JPG';
  readonly image4Filename = 'IMG_1761.JPG';
  readonly image5Filename = 'IMG_2147.JPG';
  readonly image6Filename = 'IMG_2098.jpeg';

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
