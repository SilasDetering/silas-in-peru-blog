import { Component, OnInit } from '@angular/core';
import { ImagesService } from '../../services/images.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-fullscreen-image',
  templateUrl: './fullscreen-image.component.html',
  styleUrl: './fullscreen-image.component.css'
})
export class FullscreenImageComponent implements OnInit {

  constructor(private imagesService: ImagesService, private route: ActivatedRoute, private router: Router) {
  }

  imageUrl: string | null = null;

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.imageUrl = params['image'];
    });
  }

  close() {
    this.router.navigate(['/gallery']);
  }
}
