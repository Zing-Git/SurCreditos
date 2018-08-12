import { TestBed, inject } from '@angular/core/testing';

import { CreditosService } from './creditos.service';

describe('CreditosService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CreditosService]
    });
  });

  it('should be created', inject([CreditosService], (service: CreditosService) => {
    expect(service).toBeTruthy();
  }));
});
