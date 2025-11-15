import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-nov-blog',
  templateUrl: './nov-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class NovBlogComponent {

  // Bild für das HTML (immer in der HTML festgelegt, hier wird die CDN-URL bereitgestellt)
  readonly image1Filename = '';
  readonly image2Filename = '';
  readonly image3Filename = '';
  readonly image4Filename = '';

  image1: string = '';
  image2: string = '';
  image3: string = '';
  image4: string = '';

  constructor(private sanitizer: DomSanitizer, private imagesService: ImagesService) {
    this.image1 = this.imagesService.getCdnSmallUrl(this.image1Filename);
    this.image2 = this.imagesService.getCdnSmallUrl(this.image2Filename);
    this.image3 = this.imagesService.getCdnSmallUrl(this.image3Filename);
    this.image4 = this.imagesService.getCdnSmallUrl(this.image4Filename);
  }

  /**
   * Öffnet das Bild in voller Auflösung (direkte CDN-URL).
   */
  openFullImage(image: string): void {
    const url = this.imagesService.getCdnFullUrl(image);
    window.open(url, '_blank');
  }
}
