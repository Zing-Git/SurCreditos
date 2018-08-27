import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewCreditoComponent } from './view-credito.component';

describe('ViewCreditoComponent', () => {
  let component: ViewCreditoComponent;
  let fixture: ComponentFixture<ViewCreditoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewCreditoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewCreditoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
