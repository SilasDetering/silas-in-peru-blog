import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumWiedenestComponent } from './forum-wiedenest.component';

describe('ForumWiedenestComponent', () => {
  let component: ForumWiedenestComponent;
  let fixture: ComponentFixture<ForumWiedenestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ForumWiedenestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ForumWiedenestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
