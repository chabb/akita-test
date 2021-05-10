import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ProgressStore, ProgressState } from './progress.store';
import {AkitaFiltersPlugin, searchFilter} from 'akita-filters-plugin';
import {UsersStore, UserViewModel} from './users.store';
import {UsersQuery} from './users.query';
import {map, startWith, switchMap, tap} from 'rxjs/operators';
import {ProgressService} from './progress.service';
import {Observable} from 'rxjs';
import {User} from '../in-memory-api/types';

@Injectable({ providedIn: 'root' })
export class ProgressQuery extends QueryEntity<ProgressState> {

  constructor(protected store: ProgressStore) {
    super(store);
  }
}


@Injectable({ providedIn: 'root' })
export class UserQueryService {
  userFilters;
  constructor(private userStore: UsersStore,
              private progressQuery: ProgressQuery,
              private progressService: ProgressService,
              private userQuery: UsersQuery) {
    // @ts-ignore :(
    this.userFilters = new AkitaFiltersPlugin<UsersStore>(this.userQuery);
    this.userFilters.setFilter({
      id: 'search',
      value: 'ab',
      order: 20,
      name: 'test',

      predicate: (value: UserViewModel, index, array) => {
        return searchFilter('', value);
      }
    });
  }

  updateSearchFilter(searchValue: string): void {
    if (!searchValue) {
      this.userFilters.removeFilter('search');
    } else {
      this.userFilters.setFilter(getSearchFilter(searchValue));
    }
  }

  updateStateFilter(states: Set<'a' | 'b' | 'c'>): void {
    if (!states || states.size === 0) {
      this.userFilters.removeFilter('state');
    } else {
      this.userFilters.setFilter(getStateFilter(states));
    }
  }


  getFilteredUsersWithProgress(): Observable<UserViewModel[]> {
    // @ts-ignore :(
    const select$: Observable<User[]> = this.userFilters.selectAllByFilters();
    return select$.pipe(
      // if we change the filters, we'll need to wait until progress reemit
      switchMap(users => this.progressService.get(users.map(({id}) => id))
        .pipe(
          startWith(users),
          switchMap(() => this.progressQuery.selectAll()
            .pipe(
              map(usersProgress => usersProgress
                .reduce((acc, {id, progress}) => ({...acc, [id]: progress}), {} as {[userId: string]: number})),
              map(progressMap => users.map(
                u => ({...u, progress: progressMap[u.id]} as UserViewModel))))))));
  }
}

const BASE_SEARCH_FILTER = {
  id: 'search',
  name: 'search',
  order: 2
};

const BASE_STATE_FILTER = {
  id: 'state',
  name: 'state',
  order: 3
};

const getSearchFilter = (search: string) =>
  ({...BASE_SEARCH_FILTER,
    value: search,
    predicate: (v: UserViewModel) => searchFilter(search, v) });

const getStateFilter = (states: Set<'a' | 'b' | 'c'>) =>
  ({...BASE_STATE_FILTER,
    value: states,
    predicate: (v: UserViewModel) => states.has(v.state as 'a' | 'b' | 'c')
  });
