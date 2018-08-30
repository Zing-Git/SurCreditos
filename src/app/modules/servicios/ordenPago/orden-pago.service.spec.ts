import { TestBed, inject } from '@angular/core/testing';

import { OrdenPagoService } from './orden-pago.service';

describe('OrdenPagoService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OrdenPagoService]
    });
  });

  it('should be created', inject([OrdenPagoService], (service: OrdenPagoService) => {
    expect(service).toBeTruthy();
  }));
});
