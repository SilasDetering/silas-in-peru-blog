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

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        switch (event.urlAfterRedirects) {
          case '/':
            this.title = 'Silas in Peru';
            break;
          case '/über-mich':
            this.title = 'Silas Detering';
            break;
          case '/einsatzort':
            this.title = 'Cashibo';
            break;
          case '/bilder':
            this.title = 'Galerie';
            break;
          default:
            this.title = 'Silas in Peru';
        }
      });
  }
}
