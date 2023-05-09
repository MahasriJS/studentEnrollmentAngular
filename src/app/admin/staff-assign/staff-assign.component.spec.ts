import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StaffAssignComponent } from './staff-assign.component';

describe('StaffAssignComponent', () => {
  let component: StaffAssignComponent;
  let fixture: ComponentFixture<StaffAssignComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StaffAssignComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StaffAssignComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
