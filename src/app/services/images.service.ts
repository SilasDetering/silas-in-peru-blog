import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ImagesService {

  constructor() { }

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
}
