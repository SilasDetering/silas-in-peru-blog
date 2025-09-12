import { Component } from '@angular/core';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrl: './blog.component.css'
})
export class BlogComponent {

  visibleCount: number = 2;

  onLoadMore(){
    this.visibleCount += 2;
  }

}
