import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import { ProgressStore, ProgressState } from './progress.store';
import {AkitaFiltersPlugin, searchFilter, searchFilterIn} from 'akita-filters-plugin';
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
  }

  updateSearchFilter(searchValue: string): void {
    if (!searchValue || searchValue.length === 0) {
      this.userFilters.removeFilter(SEARCH_FILTER_ID);
    } else {
      this.userFilters.setFilter(getSearchFilter(searchValue));
    }
  }

  updateStateFilter(states: Set<'a' | 'b' | 'c'>): void {
    if (!states || states.size === 0) {
      this.userFilters.removeFilter(STATE_FILTER_ID);
    } else {
      this.userFilters.setFilter(getStateFilter(states));
    }
  }

  updateSearchNameFilter(searchValue: string): void {
    if (!searchValue || searchValue.length === 0) {
      this.userFilters.removeFilter(SEARCH_BY_NAME_FILTER_ID);
    } else {
      this.userFilters.setFilter(getSearchOnNameFilter(searchValue));
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

export const SEARCH_FILTER_ID = 'search';
export const STATE_FILTER_ID = 'state';
export const SEARCH_BY_NAME_FILTER_ID = 'searchByName';

const getBaseFilter = (id: string, name: string, order: number) => ({id, name, order});

const baseSearchFilter = getBaseFilter(SEARCH_FILTER_ID, SEARCH_FILTER_ID, 2);
const baseStateFilter = getBaseFilter(STATE_FILTER_ID, STATE_FILTER_ID, 3);
const baseSearchByNameFilter = getBaseFilter(SEARCH_BY_NAME_FILTER_ID, SEARCH_BY_NAME_FILTER_ID, 4);

const getSearchFilter = (search: string) =>
  ({...baseSearchFilter,
    value: search,
    predicate: (v: UserViewModel) => searchFilter(search, v) });

const getStateFilter = (states: Set<'a' | 'b' | 'c'>) =>
  ({...baseStateFilter,
    value: states,
    predicate: (v: UserViewModel) => states.has(v.state as 'a' | 'b' | 'c')
  });

const getSearchOnNameFilter = (search: string) =>
  ({...baseSearchByNameFilter,
    value: search,
    predicate: (v: UserViewModel) => searchFilterIn(search, v, 'name')
  });
