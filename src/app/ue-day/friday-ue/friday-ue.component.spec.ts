import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FridayUeComponent } from './friday-ue.component';

describe('FridayUeComponent', () => {
  let component: FridayUeComponent;
  let fixture: ComponentFixture<FridayUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FridayUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FridayUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
