import { TestBed } from '@angular/core/testing';

import { ModalFocuxService } from './modal-focux.service';

describe('ModalFocuxService', () => {
  let service: ModalFocuxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModalFocuxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
