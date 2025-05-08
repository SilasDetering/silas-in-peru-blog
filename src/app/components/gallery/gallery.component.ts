import { Component } from '@angular/core';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrl: './gallery.component.css'
})
export class GalleryComponent {
  images: string[] = [
    'assets/fotos/PXL_20240726_110800595.jpg',
    'assets/fotos/PXL_20240726_142318179.jpg',
    'assets/fotos/PXL_20240727_164913269.jpg',
    'assets/fotos/PXL_20240728_050531932.jpg',
    'assets/fotos/PXL_20240727_194145017.MP.jpg',
    'assets/fotos/PXL_20240728_050531932.jpg',
    'assets/fotos/PXL_20240728_122812523.MP.jpg',
    'assets/fotos/PXL_20240728_191633309.NIGHT.jpg',
    'assets/fotos/PXL_20240729_184043086.jpg',
  ];

  selectedImage: string | null = null;

  openImage(image: string): void {
    this.selectedImage = image;
  }

  closeImage(): void {
    this.selectedImage = null;
  }
}
