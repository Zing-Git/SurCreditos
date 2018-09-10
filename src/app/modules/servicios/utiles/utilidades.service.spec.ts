import { TestBed, inject } from '@angular/core/testing';

import { UtilidadesService } from './utilidades.service';

describe('UtilidadesService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilidadesService]
    });
  });

  it('should be created', inject([UtilidadesService], (service: UtilidadesService) => {
    expect(service).toBeTruthy();
  }));
});


