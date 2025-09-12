import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-sept-11-blog',
  templateUrl: './sept-11-blog.component.html',
  styleUrls: ['../blog-pages.css']
})
export class Sept11BlogComponent {

  URL1 = 'https://www.youtube.com/embed/dQw4w9WgXcQ';
  URL2 = 'https://www.youtube.com/embed/1La4QzGeaaQ';

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
