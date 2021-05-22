import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MapsComponent } from './maps.component';
import {configureRotationIntervalProvider} from './providers';

describe('MapsComponent', () => {
  let component: MapsComponent;
  let fixture: ComponentFixture<MapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MapsComponent ],
      providers: [ configureRotationIntervalProvider()]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
