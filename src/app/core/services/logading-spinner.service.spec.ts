import { TestBed } from '@angular/core/testing';

import { LogadingSpinnerService } from './logading-spinner.service';

describe('LogadingSpinnerService', () => {
  let service: LogadingSpinnerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LogadingSpinnerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
