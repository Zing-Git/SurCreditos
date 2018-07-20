import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCreditosComponent } from './crud-creditos.component';

describe('CrudCreditosComponent', () => {
  let component: CrudCreditosComponent;
  let fixture: ComponentFixture<CrudCreditosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCreditosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCreditosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
