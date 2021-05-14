import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterComponent } from './filter.component';
import {MockBuilder, MockRender} from 'ng-mocks';
import {SharedModule} from '../../shared/shared.module';
import {UserQueryService} from '../../shared/state/users-query.service';
import {FormControl} from '@angular/forms';
import {of} from 'rxjs';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(() => MockBuilder(FilterComponent, SharedModule)
    .mock(UserQueryService, {
      searchByNameControl: () => new FormControl(''),
      searchByStateControl: () => new FormControl([0, 100]),
      searchFilterControl: () => new FormControl(''),
      userFilters: {selectFilters: () => of([] as any)}
    } as UserQueryService));

  beforeEach(() => {
    fixture = MockRender(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
