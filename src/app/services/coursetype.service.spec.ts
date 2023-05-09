import { TestBed } from '@angular/core/testing';

import { CoursetypeService } from './coursetype.service';

describe('CoursetypeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CoursetypeService = TestBed.get(CoursetypeService);
    expect(service).toBeTruthy();
  });
});
