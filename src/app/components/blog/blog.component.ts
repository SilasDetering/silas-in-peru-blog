import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {
  visibleCount: number = 2;

  // Beispiel-URLs für horizontale und vertikale YouTube-Videos
  youtubeHorizontal: SafeResourceUrl;
  youtubeVertical: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {
    // Beispiel-IDs, bitte durch echte ersetzen
    this.youtubeHorizontal = this.sanitizeYoutube('https://www.youtube.com/embed/dQw4w9WgXcQ');
    this.youtubeVertical = this.sanitizeYoutube('https://www.youtube.com/embed/1La4QzGeaaQ');
  }

  sanitizeYoutube(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  onLoadMore(){
    this.visibleCount += 2;
  }
}
