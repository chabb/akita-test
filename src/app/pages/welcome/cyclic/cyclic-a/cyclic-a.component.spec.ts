import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CyclicAComponent } from './cyclic-a.component';

describe('CyclicAComponent', () => {
  let component: CyclicAComponent;
  let fixture: ComponentFixture<CyclicAComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CyclicAComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CyclicAComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
