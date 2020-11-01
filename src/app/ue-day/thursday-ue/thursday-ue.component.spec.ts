import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ThursdayUeComponent } from './thursday-ue.component';

describe('ThursdayUeComponent', () => {
  let component: ThursdayUeComponent;
  let fixture: ComponentFixture<ThursdayUeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ThursdayUeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ThursdayUeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
