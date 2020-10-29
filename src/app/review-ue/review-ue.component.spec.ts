import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewUeComponent } from './review-ue.component';

describe('ReviewUeComponent', () => {
  let component: ReviewUeComponent;
  let fixture: ComponentFixture<ReviewUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReviewUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReviewUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
