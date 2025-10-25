import { Component, Type } from '@angular/core';
import { Sept20BlogComponent } from '../../blog-pages/sept-20-blog/sept-20-blog.component';
import { Okt20BlogComponent } from '../../blog-pages/okt-20-blog/okt-20-blog.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {

  blogComponents: Type<any>[] = [
    // weitere Komponenten hier ergänzen, neueste zuerst
    Okt20BlogComponent,
    Sept20BlogComponent,
  ];

  visibleCount = 1;

  onLoadMore() {
    if (this.visibleCount < this.blogComponents.length) {
      this.visibleCount++;
    }
  }
}
