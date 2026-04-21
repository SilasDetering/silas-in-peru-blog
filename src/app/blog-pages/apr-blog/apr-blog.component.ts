import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-apr-blog',
  templateUrl: './apr-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class AprBlogComponent {

  readonly image1Filename = 'IMG_2621.JPG';
  readonly image2Filename = 'F5F1F169-8C4F-4C5D-838A-12DA3DB8BA60_anonymized.png';
  readonly image3Filename = 'IMG_2673.jpeg';
  readonly image4Filename = '060d3e77-241a-4001-b85d-7dc573262fff.JPG';
  readonly image5Filename = 'dji_fly_20260309_183024_0069_1773099941351_photo_beautify.JPG';
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
