import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OdometriaComponent } from './odometria.component';

describe('OdometriaComponent', () => {
  let component: OdometriaComponent;
  let fixture: ComponentFixture<OdometriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OdometriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OdometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
