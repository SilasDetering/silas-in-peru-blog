import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SlidingGalleryComponent } from './sliding-gallery.component';

describe('SlidingGalleryComponent', () => {
  let component: SlidingGalleryComponent;
  let fixture: ComponentFixture<SlidingGalleryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SlidingGalleryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SlidingGalleryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
