import { Component, Type, OnInit, OnDestroy, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { Sept20BlogComponent } from '../../blog-pages/(1) sept-blog/sept-20-blog.component';
import { Okt20BlogComponent } from '../../blog-pages/(2) okt-blog/okt-20-blog.component';
import { NovBlogComponent } from '../../blog-pages/(3) nov-blog/nov-blog.component';
import { DezBlogComponent } from '../../blog-pages/(4) dez-blog/dez-blog.component';
import { FebBlogComponent } from '../../blog-pages/(5) feb-blog/feb-blog.component';
import { JunJulBlogComponent } from '../../blog-pages/(7) jun-jul-blog/jun-jul-blog.component';
import { AprBlogComponent } from '../../blog-pages/(6) apr-blog/apr-blog.component';

export interface BlogEntry {
  id: string;
  month: string;
  date: string;
  location?: string;
  component: Type<any>;
}

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit, AfterViewInit, OnDestroy {

  blogEntries: BlogEntry[] = [
    {
      id: 'blog-jul-2026',
      month: 'Juli 2026',
      date: '11. Juli 2026',
      location: 'Pucallpa, Cashibo',
      component: JunJulBlogComponent,
    },
    {
      id: 'blog-mai-2026',
      month: 'Mai 2026',
      date: '30. Mai 2026',
      location: 'Pacaya-Samiria, Atsakus, Huaraz',
      component: AprBlogComponent,
    },
    {
      id: 'blog-mar-2026',
      month: 'März 2026',
      date: '13. März 2026',
      location: 'Cashibo, Lima, Azpitia',
      component: FebBlogComponent,
    },
    {
      id: 'blog-jan-2026',
      month: 'Januar 2026',
      date: '10. Januar 2026',
      location: 'Tingo María, Lima, Paracas',
      component: DezBlogComponent,
    },
    {
      id: 'blog-nov-2025',
      month: 'November 2025',
      date: '30. November 2025',
      location: 'Pucallpa, Cashibo',
      component: NovBlogComponent,
    },
    {
      id: 'blog-okt-2025',
      month: 'Oktober 2025',
      date: '31. Oktober 2025',
      location: 'Pucallpa, Cashibo',
      component: Okt20BlogComponent,
    },
    {
      id: 'blog-sept-2025',
      month: 'September 2025',
      date: '20. September 2025',
      location: 'Arequipa',
      component: Sept20BlogComponent,
    },
  ];

  get blogComponents(): Type<any>[] {
    return this.blogEntries.map(e => e.component);
  }

  visibleCount = 1;
  activeBlogIndex = 0;
  private observer?: IntersectionObserver;

  constructor(private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {}

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  ngOnDestroy(): void {
    if (this.observer) {
      this.observer.disconnect();
    }
  }

  onLoadMore(): void {
    if (this.visibleCount < this.blogEntries.length) {
      this.visibleCount++;
      this.cdr.detectChanges();
      this.observeElements();
    }
  }

  scrollToBlog(index: number): void {
    if (index < 0 || index >= this.blogEntries.length) return;

    this.activeBlogIndex = index;

    if (this.visibleCount <= index) {
      this.visibleCount = index + 1;
      this.cdr.detectChanges();
      this.observeElements();
    }

    setTimeout(() => {
      const entry = this.blogEntries[index];
      const element = document.getElementById(entry.id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 60);
  }

  private initIntersectionObserver(): void {
    if (typeof window === 'undefined' || !('IntersectionObserver' in window)) return;

    const scrollContainer = document.querySelector('.wrapper');

    this.observer = new IntersectionObserver((entries) => {
      const visible = entries
        .filter(entry => entry.isIntersecting)
        .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

      if (visible.length > 0) {
        const topEntry = visible[0];
        const id = topEntry.target.id;
        const foundIndex = this.blogEntries.findIndex(e => e.id === id);
        if (foundIndex !== -1) {
          this.activeBlogIndex = foundIndex;
          this.cdr.detectChanges();
        }
      }
    }, {
      root: scrollContainer,
      threshold: [0.05, 0.2],
      rootMargin: '-40px 0px -50% 0px'
    });

    this.observeElements();
  }

  private observeElements(): void {
    if (!this.observer) return;
    setTimeout(() => {
      this.blogEntries.forEach((entry, i) => {
        if (i < this.visibleCount) {
          const el = document.getElementById(entry.id);
          if (el) {
            this.observer?.observe(el);
          }
        }
      });
    }, 100);
  }
}
