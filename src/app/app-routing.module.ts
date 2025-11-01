import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LocationComponent } from './components/location/location.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ImpressumComponent } from './components/impressum/impressum.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' }, // HomeComponent
  { path: 'home', component: HomeComponent },
  { path: 'ueber-mich', component: AboutMeComponent },
  { path: 'einsatzort', component: LocationComponent },
  { path: 'bilder', component: GalleryComponent },
  { path: 'impressum', component: ImpressumComponent },
  { path: '**', redirectTo: 'home' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    // ensure navigations go to top of page and enable anchor scrolling
    scrollPositionRestoration: 'top',
    anchorScrolling: 'enabled'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule {}
