import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewkanbanComponent } from './viewkanban.component';

describe('ViewkanbanComponent', () => {
  let component: ViewkanbanComponent;
  let fixture: ComponentFixture<ViewkanbanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewkanbanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewkanbanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
