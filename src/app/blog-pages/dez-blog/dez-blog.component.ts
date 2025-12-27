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
  readonly image1Filename = 'IMG_1459.JPG';
  readonly image2Filename = 'IMG_2919.JPG';
  readonly image3Filename = 'B3188E6D-32D6-43AF-BF0A-9E3E144C3747.JPG';
  readonly image4Filename = '';
  readonly image5Filename = '';

  image1: string = '';
  image2: string = '';
  image3: string = '';
  image4: string = '';
  image5: string = '';

  constructor(private sanitizer: DomSanitizer, private imagesService: ImagesService) {
    this.image1 = this.imagesService.getCdnSmallUrl(this.image1Filename);
    this.image2 = this.imagesService.getCdnSmallUrl(this.image2Filename);
    this.image3 = this.imagesService.getCdnSmallUrl(this.image3Filename);
    this.image4 = this.imagesService.getCdnSmallUrl(this.image4Filename);
  }
}
