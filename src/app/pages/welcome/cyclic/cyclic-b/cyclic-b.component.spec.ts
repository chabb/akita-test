import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclicBComponent } from './cyclic-b.component';

describe('CyclicBComponent', () => {
  let component: CyclicBComponent;
  let fixture: ComponentFixture<CyclicBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclicBComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyclicBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
