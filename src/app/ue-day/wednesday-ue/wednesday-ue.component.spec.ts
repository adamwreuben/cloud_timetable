import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WednesdayUeComponent } from './wednesday-ue.component';

describe('WednesdayUeComponent', () => {
  let component: WednesdayUeComponent;
  let fixture: ComponentFixture<WednesdayUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WednesdayUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WednesdayUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
