import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrudCreditosAdminComponent } from './crud-creditos-admin.component';

describe('CrudCreditosAdminComponent', () => {
  let component: CrudCreditosAdminComponent;
  let fixture: ComponentFixture<CrudCreditosAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrudCreditosAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrudCreditosAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
