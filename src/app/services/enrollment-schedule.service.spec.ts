import { TestBed } from '@angular/core/testing';

import { EnrollmentScheduleService } from './enrollment-schedule.service';

describe('EnrollmentScheduleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EnrollmentScheduleService = TestBed.get(EnrollmentScheduleService);
    expect(service).toBeTruthy();
  });
});
