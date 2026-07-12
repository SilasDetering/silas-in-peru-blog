import { Component, Type } from '@angular/core';
import { Sept20BlogComponent } from '../../blog-pages/(1) sept-blog/sept-20-blog.component';
import { Okt20BlogComponent } from '../../blog-pages/(2) okt-blog/okt-20-blog.component';
import { NovBlogComponent } from '../../blog-pages/(3) nov-blog/nov-blog.component';
import { DezBlogComponent } from '../../blog-pages/(4) dez-blog/dez-blog.component';
import { FebBlogComponent } from '../../blog-pages/(5) feb-blog/feb-blog.component';
import { JunJulBlogComponent } from '../../blog-pages/(7) jun-jul-blog/jun-jul-blog.component';
import { AprBlogComponent } from '../../blog-pages/(6) apr-blog/apr-blog.component';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {

  blogComponents: Type<any>[] = [
    JunJulBlogComponent,
    AprBlogComponent,
    FebBlogComponent,
    DezBlogComponent,
    NovBlogComponent,
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
