import {ComponentFixture} from '@angular/core/testing';
import {UserTableComponent} from './user-table.component';
import {MockBuilder, MockRender} from 'ng-mocks';
import {UserTableModule} from './user-table.module';
import {UserQueryService} from '../../shared/state/users-query.service';
import {FormControl} from '@angular/forms';
import {of} from 'rxjs';
import {UsersService} from '../../shared/state/users/users.service';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;

  beforeEach(() => MockBuilder(UserTableComponent, UserTableModule)
    .mock(UsersService, { get: () => of([])})
    .mock(UserQueryService, {
      getStateFiltersAsObject: () => ({ a: true, b: false, c: false, d: false }),
      searchFilterControl: () => new FormControl(''),
      searchByNameControl: () => new FormControl(''),
      userFilters: {selectFilters: () => of([] as any)}
    } as UserQueryService));

  beforeEach(() => {
    fixture = MockRender(UserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
})
;
