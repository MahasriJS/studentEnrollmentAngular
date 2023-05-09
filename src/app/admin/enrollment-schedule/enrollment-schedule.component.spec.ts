import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EnrollmentScheduleComponent } from './enrollment-schedule.component';

describe('EnrollmentScheduleComponent', () => {
  let component: EnrollmentScheduleComponent;
  let fixture: ComponentFixture<EnrollmentScheduleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EnrollmentScheduleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EnrollmentScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
