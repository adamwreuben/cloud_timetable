import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CollisionComponent } from './collision.component';

describe('CollisionComponent', () => {
  let component: CollisionComponent;
  let fixture: ComponentFixture<CollisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CollisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CollisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
