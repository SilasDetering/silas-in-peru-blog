import { Component } from '@angular/core';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  folders: { name: string; images: string[] }[] = [];

  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_FOLDER = '09-arequipa';
  private readonly CDN_SMALL_SUBFOLDER = '800px';

  constructor(private imagesService: ImagesService) {
    const folderNames = this.imagesService.getFolders();
    this.folders = folderNames.map(name => ({
      name,
      // map local paths from JSON to CDN small (200px) URLs
      images: this.imagesService.getImagesByFolder(name).map(p => this.toCdnSmallUrl(p))
    }));
  }

  openImage(image: string): void {
    // Öffne die große Version (ohne 200px) in einem neuen Tab
    const filename = this.extractFilename(image);
    const fullUrl = `${this.CDN_BASE}/${this.CDN_FOLDER}/${filename}`;
    window.open(fullUrl, '_blank');
    console.log('Bild geöffnet:', fullUrl);
  }

  onLoadMore(): void {
    console.log('Mehr Bilder laden...');
  }

  // Hilfsfunktionen
  private extractFilename(path: string): string {
    const segments = path.split('/');
    return segments[segments.length - 1];
  }

  private toCdnSmallUrl(path: string): string {
    const filename = this.extractFilename(path);
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${this.CDN_SMALL_SUBFOLDER}/${filename}`;
  }
}
