import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavigaciaComponent } from './navigacia.component';

describe('NavigaciaComponent', () => {
  let component: NavigaciaComponent;
  let fixture: ComponentFixture<NavigaciaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavigaciaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigaciaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
