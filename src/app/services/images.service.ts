import { Injectable } from '@angular/core';
import images from '../../assets/fotos/images.json';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  // CDN settings (zentralisiert, wiederverwendbar)
  private readonly CDN_BASE = 'https://silas-in-peru-fotos.b-cdn.net';
  private readonly CDN_SMALL_SUBFOLDER = '800px';

  private imageData: { [key: string]: string[] } = images as any;

  /**
   * Gibt die kleine (800px) CDN-URL für ein Bild zurück.
   * folder: z.B. '09-arequipa'
   */
  getCdnSmallUrl(folder: string, filename: string): string {
    const fname = (filename.split('/').pop() || filename).trim();
    return `${this.CDN_BASE}/${folder}/${this.CDN_SMALL_SUBFOLDER}/${fname}`;
  }

  /**
   * Gibt die volle CDN-URL für ein Bild zurück (ohne Subfolder).
   */
  getCdnFullUrl(folder: string, filename: string): string {
    const fname = (filename.split('/').pop() || filename).trim();
    return `${this.CDN_BASE}/${folder}/${fname}`;
  }

  getFolders(): string[] {
    return Object.keys(this.imageData);
  }

  getImagesByFolder(folder: string): string[] {
    return this.imageData[folder] || [];
  }
}
