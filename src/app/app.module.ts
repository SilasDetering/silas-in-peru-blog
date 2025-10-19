import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { BlogComponent } from './components/blog/blog.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LocationComponent } from './components/location/location.component';
import { FooterComponent } from './components/footer/footer.component';
import { SupportComponent } from './components/support/support.component';
import { KontaktComponent } from './components/kontakt/kontakt.component';
import { ImpressumComponent } from './components/impressum/impressum.component';
import { provideHttpClient } from '@angular/common/http';
import { Sept20BlogComponent } from './blog-pages/sept-20-blog/sept-20-blog.component';
import { SlidingGalleryComponent } from './components/sliding-gallery/sliding-gallery.component';
import { ForumWiedenestComponent } from './components/forum-wiedenest/forum-wiedenest.component';
import { VoluntariosComponent } from './components/voluntarios/voluntarios.component';
import { Okt20BlogComponent } from './blog-pages/okt-20-blog/okt-20-blog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    BlogComponent,
    NavbarComponent,
    GalleryComponent,
    AboutMeComponent,
    LocationComponent,
    FooterComponent,
    SupportComponent,
    KontaktComponent,
    ImpressumComponent,
    Sept20BlogComponent,
    SlidingGalleryComponent,
    ForumWiedenestComponent,
    VoluntariosComponent,
    Okt20BlogComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
  ],
  providers: [
      provideHttpClient()
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
