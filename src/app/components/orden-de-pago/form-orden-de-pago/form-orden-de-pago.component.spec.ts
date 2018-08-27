import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormOrdenDePagoComponent } from './form-orden-de-pago.component';

describe('FormOrdenDePagoComponent', () => {
  let component: FormOrdenDePagoComponent;
  let fixture: ComponentFixture<FormOrdenDePagoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormOrdenDePagoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormOrdenDePagoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
