import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutMeComponent } from './components/about-me/about-me.component';
import { LocationComponent } from './components/location/location.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { FullscreenImageComponent } from './components/fullscreen-image/fullscreen-image.component';

const routes: Routes = [
  { path: '', component: AboutMeComponent, pathMatch: 'full' }, // HomeComponent
  { path: 'über-mich', component: AboutMeComponent },
  { path: 'einsatzort', component: LocationComponent },
  { path: 'bilder', component: GalleryComponent },
  { path: 'bilder/fullscreen/:image', component: FullscreenImageComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
