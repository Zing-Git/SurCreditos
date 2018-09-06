import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCuotasComponent } from './modal-cuotas.component';

describe('ModalCuotasComponent', () => {
  let component: ModalCuotasComponent;
  let fixture: ComponentFixture<ModalCuotasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCuotasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCuotasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
