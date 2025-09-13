import { Injectable } from '@angular/core';
import images from '../../assets/fotos/images.json';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {
  private imageData: { [key: string]: string[] } = images as any;

  getFolders(): string[] {
    return Object.keys(this.imageData);
  }

  getImagesByFolder(folder: string): string[] {
    return this.imageData[folder] || [];
  }
}
