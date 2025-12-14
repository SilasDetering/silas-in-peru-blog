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
  readonly image1Filename = '9C3EC1A0-F138-46A3-BC42-6CEB0F9457BF_1_105_c.jpeg';
  readonly image2Filename = 'A770E0B8-8871-427F-B30E-921DD2E8A0DA.JPG';
  readonly image3Filename = 'IMG_1031.JPG';
  readonly image4Filename = 'IMG_1214.jpeg';

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
}
