import { Component } from '@angular/core';
import { ImagesService } from '../../services/images.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {

  constructor(private imagesService: ImagesService, private router: Router) {
    this.images = this.imagesService.images;
  }

  images: string[] = [];

  openImage(image: string): void {
    this.router.navigate(['/bilder/fullscreen', image]);
  }

  onLoadMore(){
    
  }
}
