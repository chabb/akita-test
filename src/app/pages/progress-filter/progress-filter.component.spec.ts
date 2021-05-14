import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressFilterComponent } from './progress-filter.component';
import {MockBuilder, MockRender} from 'ng-mocks';
import {SharedModule} from '../../shared/shared.module';
import {UserQueryService} from '../../shared/state/users-query.service';
import {FormControl} from '@angular/forms';

describe('ProgressFilterComponent', () => {
  let component: ProgressFilterComponent;
  let fixture: ComponentFixture<ProgressFilterComponent>;

  beforeEach( () => MockBuilder(ProgressFilterComponent, SharedModule)
    .mock(UserQueryService, {
      searchByProgressControl: () => new FormControl([0, 100])
    }));

  beforeEach(() => {
    fixture = MockRender(ProgressFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
