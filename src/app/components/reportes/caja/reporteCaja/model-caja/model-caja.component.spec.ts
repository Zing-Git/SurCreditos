import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModelCajaComponent } from './model-caja.component';

describe('ModelCajaComponent', () => {
  let component: ModelCajaComponent;
  let fixture: ComponentFixture<ModelCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModelCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModelCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
