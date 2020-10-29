import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassFileComponent } from './class-file.component';

describe('ClassFileComponent', () => {
  let component: ClassFileComponent;
  let fixture: ComponentFixture<ClassFileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ClassFileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ClassFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
