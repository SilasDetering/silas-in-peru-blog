import { Component } from '@angular/core';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  folders: { name: string; images: string[] }[] = [];

  constructor(private imagesService: ImagesService) {
    const folderNames = this.imagesService.getFolders();
    this.folders = folderNames.map(name => ({
      name,
      images: this.imagesService.getImagesByFolder(name)
    }));
  }

  openImage(image: string): void {
    console.log('Bild geöffnet:', image);
  }

  onLoadMore(): void {
    console.log('Mehr Bilder laden...');
  }
}
