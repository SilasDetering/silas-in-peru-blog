import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-okt-11-blog',
  templateUrl: './okt-11-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class Okt11BlogComponent {

  URL1 = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  URL2 = 'https://www.youtube.com/embed/hfsD4ZT5mAw';

  youtubeHorizontal: SafeResourceUrl;
  youtubeVertical: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    this.youtubeHorizontal = this.sanitizeYoutube(this.URL1);
    this.youtubeVertical = this.sanitizeYoutube(this.URL2);
  }

  sanitizeYoutube(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
