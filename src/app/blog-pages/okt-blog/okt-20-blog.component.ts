import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-okt-20-blog',
  templateUrl: './okt-20-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class Okt20BlogComponent {

  // Bild für das HTML (immer in der HTML festgelegt, hier wird die CDN-URL bereitgestellt)
  readonly image1Filename = 'DSCF8352.jpg';
  readonly image2Filename = 'IMG_0752.jpeg';
  readonly image3Filename = 'IMG_0993.JPG';
  readonly image4Filename = 'DSCF8411.jpg';

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
