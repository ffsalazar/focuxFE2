import { TestBed } from '@angular/core/testing';

import { EvaluationResolver } from './evaluation.resolver';

describe('EvaluationResolver', () => {
  let resolver: EvaluationResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(EvaluationResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
