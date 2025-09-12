import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title: string = 'Silas in Peru';
  picture: string = 'colca_canyon.JPG';

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        console.log('Navigation event:', event.urlAfterRedirects);
        switch (event.urlAfterRedirects) {
          case '/home':
            this.title = 'Blog';
            this.picture = 'colca_canyon.JPG';
            break;
          case '/ueber-mich':
            this.title = 'Silas Detering';
            this.picture = 'gruppenfoto_salitas.JPG';
            break;
          case '/einsatzort':
            this.title = 'Cashibo';
            this.picture = 'cashibo-rainbow.jpeg'
            break;
          case '/bilder':
            this.title = 'Galerie';
            this.picture = 'salitas.jpeg';
            break;
          default:
            this.title = 'Silas in Peru';
            this.picture = 'colca_canyon.JPG';
        }
      });
  }
}
