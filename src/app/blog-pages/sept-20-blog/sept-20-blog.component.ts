import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-sept-20-blog',
  templateUrl: './sept-20-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class Sept20BlogComponent {

  URL1 = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  URL2 = 'https://www.youtube.com/embed/1La4QzGeaaQ';

  youtubeHorizontal: SafeResourceUrl;
  youtubeVertical: SafeResourceUrl;

  // Bild für das HTML (immer in der HTML festgelegt, hier wird die CDN-URL bereitgestellt)
  readonly cdnFolder = '09-arequipa';
  readonly image1Filename = '0FD23F59-0AE2-47F1-BF90-87C5E897E120.jpeg';
  readonly image2Filename = 'IMG_0538.jpeg';
  readonly image3Filename = '7B4ABAAE-5602-4EAF-B17C-4238CB9E7AAA.jpeg';

  image1: string = '';
  image2: string = '';
  image3: string = '';

  constructor(private sanitizer: DomSanitizer, private imagesService: ImagesService) {
    this.youtubeHorizontal = this.sanitizeYoutube(this.URL1);
    this.youtubeVertical = this.sanitizeYoutube(this.URL2);
    this.image1 = this.imagesService.getCdnSmallUrl(this.cdnFolder, this.image1Filename);
    this.image2 = this.imagesService.getCdnSmallUrl(this.cdnFolder, this.image2Filename);
    this.image3 = this.imagesService.getCdnSmallUrl(this.cdnFolder, this.image3Filename);
  }

  /**
   * Öffnet das Bild in voller Auflösung (direkte CDN-URL).
   */
  openFullImage(image: string): void {
    const url = this.imagesService.getCdnFullUrl(this.cdnFolder, image);
    window.open(url, '_blank');
  }

  sanitizeYoutube(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
