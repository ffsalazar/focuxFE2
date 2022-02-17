import { TestBed } from '@angular/core/testing';

import { AssingmentOccupationService } from './assingment-occupation.service';

describe('AssingmentOccupationService', () => {
  let service: AssingmentOccupationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssingmentOccupationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
