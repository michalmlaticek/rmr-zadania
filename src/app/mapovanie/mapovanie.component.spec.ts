import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapovanieComponent } from './mapovanie.component';

describe('MapovanieComponent', () => {
  let component: MapovanieComponent;
  let fixture: ComponentFixture<MapovanieComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapovanieComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapovanieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
