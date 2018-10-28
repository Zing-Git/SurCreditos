import { TestBed, inject } from '@angular/core/testing';

import { CajaService } from './caja.service';

describe('CajaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CajaService]
    });
  });

  it('should be created', inject([CajaService], (service: CajaService) => {
    expect(service).toBeTruthy();
  }));
});
