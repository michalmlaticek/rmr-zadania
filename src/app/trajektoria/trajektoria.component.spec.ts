import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrajektoriaComponent } from './trajektoria.component';

describe('TrajektoriaComponent', () => {
  let component: TrajektoriaComponent;
  let fixture: ComponentFixture<TrajektoriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrajektoriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrajektoriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
