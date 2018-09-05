import { TestBed, inject } from '@angular/core/testing';

import { CuotasService } from './cuotas.service';

describe('CuotasService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CuotasService]
    });
  });

  it('should be created', inject([CuotasService], (service: CuotasService) => {
    expect(service).toBeTruthy();
  }));
});
