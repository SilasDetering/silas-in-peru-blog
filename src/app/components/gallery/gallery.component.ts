import { Component } from '@angular/core';
import { ImagesService } from '../../services/images.service';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.css']
})
export class GalleryComponent {

  // vorher string[] -> jetzt Objekt mit url + optional comment
  folders: { name: string; images: { filename: string; url: string; comment?: string}[] }[] = [];

  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_FOLDER = '09-arequipa';
  private readonly CDN_SMALL_SUBFOLDER = '800px';

  constructor(private imagesService: ImagesService) {
    const folderNames = this.imagesService.getFolders();
    this.folders = folderNames.map(name => ({
      name,
      images: this.imagesService.getImagesByFolder(name).map(entry => {
        // entry kann string "name.jpg" oder objekt { "name.jpg": "comment" }
        if (typeof entry === 'string') {
          const filename = (entry.split('/').pop() || entry).trim();
          return { filename, url: this.toCdnSmallUrl(filename), showCaption: false };
        } else if (entry && typeof entry === 'object') {
          const filename = Object.keys(entry)[0];
          const comment = (entry as any)[filename] || '';
          const fname = (filename.split('/').pop() || filename).trim();
          return { filename: fname, url: this.toCdnSmallUrl(fname), comment, showCaption: false };
        } else {
          const fallback = String(entry);
          const filename = (fallback.split('/').pop() || fallback).trim();
          return { filename, url: this.toCdnSmallUrl(filename), showCaption: false };
        }
      })
    }));
  }

  openImage(image: any): void {
    // akzeptiert string oder das image-objekt
    let filename = '';
    if (!image) return;
    if (typeof image === 'string') {
      filename = (image.split('/').pop() || image).trim();
    } else if (image.filename) {
      filename = image.filename;
    } else if (image.url) {
      filename = (image.url.split('/').pop() || image.url).trim();
    }

    const fullUrl = `${this.CDN_BASE}/${this.CDN_FOLDER}/${filename}`;
    window.open(fullUrl, '_blank');
    console.log('Bild geöffnet:', fullUrl);
  }

  onLoadMore(): void {
    console.log('Mehr Bilder laden...');
  }

  private toCdnSmallUrl(pathOrName: string): string {
    const filename = (pathOrName.split('/').pop() || pathOrName).trim();
    return `${this.CDN_BASE}/${this.CDN_FOLDER}/${this.CDN_SMALL_SUBFOLDER}/${filename}`;
  }
}
