import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormCreditoComponent } from './form-credito.component';

describe('FormCreditoComponent', () => {
  let component: FormCreditoComponent;
  let fixture: ComponentFixture<FormCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
