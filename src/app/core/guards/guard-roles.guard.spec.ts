import { TestBed } from '@angular/core/testing';

import { CustomAuthGuard } from './custom-auth.guard';

describe('GuardRolesGuard', () => {
  let guard: CustomAuthGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomAuthGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
