import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TuesdayUeComponent } from './tuesday-ue.component';

describe('TuesdayUeComponent', () => {
  let component: TuesdayUeComponent;
  let fixture: ComponentFixture<TuesdayUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TuesdayUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TuesdayUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
