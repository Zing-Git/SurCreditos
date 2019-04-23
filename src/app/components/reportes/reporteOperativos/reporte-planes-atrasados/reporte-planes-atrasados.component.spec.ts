import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportePlanesAtrasadosComponent } from './reporte-planes-atrasados.component';

describe('ReportePlanesAtrasadosComponent', () => {
  let component: ReportePlanesAtrasadosComponent;
  let fixture: ComponentFixture<ReportePlanesAtrasadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReportePlanesAtrasadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReportePlanesAtrasadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
