import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MondayUeComponent } from './monday-ue.component';

describe('MondayUeComponent', () => {
  let component: MondayUeComponent;
  let fixture: ComponentFixture<MondayUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MondayUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MondayUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
