import { Component, Type } from '@angular/core';
import { Sept11BlogComponent } from '../../blog-pages/sept-11-blog/sept-11-blog.component';
import { Okt11BlogComponent } from '../../blog-pages/okt-11-blog/okt-11-blog.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {

  blogComponents: Type<any>[] = [
    // weitere Komponenten hier ergänzen, neueste zuerst
    Okt11BlogComponent,
    Sept11BlogComponent,
  ];

  visibleCount = 1;

  onLoadMore() {
    if (this.visibleCount < this.blogComponents.length) {
      this.visibleCount++;
    }
  }
}
