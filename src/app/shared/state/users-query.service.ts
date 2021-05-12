import {Injectable} from '@angular/core';
import {UsersStore, UserViewModel} from './users/users.store';
import {ProgressService} from './progress/progress.service';
import {UsersQuery} from './users/users.query';
import {AkitaFiltersPlugin} from 'akita-filters-plugin';
import {Observable} from 'rxjs';
import {User} from '../in-memory-api/types';
import {map, startWith, switchMap} from 'rxjs/operators';
import {ProgressQuery} from './progress/progress.query';
import {FILTERS, getSearchOnNameFilter, getSearchFilter, getStateFilter, STATE_FILTERS, getProgressFilter} from './filters';
import {FormControl} from '@angular/forms';

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

  // form controls helper

  getStateFiltersAsObject = () => Array.from(
    this.userFilters.getFilterValue(FILTERS.STATE_FILTER_ID) as Set<string> ??
    []).reduce((acc: any, v: string) => ({...acc, [v]: true}), {})

  searchFilterControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_FILTER_ID) ?? '');
  searchByNameControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_BY_NAME_FILTER_ID) ?? '');
  searchByStateControl = () => {
    const initialSelectedFilters = this.getStateFiltersAsObject();
    return new FormControl(STATE_FILTERS.map(({text, value}) => ({
      value,
      label: text,
      checked: initialSelectedFilters[value]})));
  }

  searchByProgressControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_BY_PROGRESS_FILTER_ID) ?? [0, 100]);

  updateSearchFilter(searchValue: string): void {
    if (!searchValue || searchValue.length === 0) {
      this.userFilters.removeFilter(FILTERS.SEARCH_FILTER_ID);
    } else {
      this.userFilters.setFilter(getSearchFilter(searchValue));
    }
  }

  updateProgressFilter(range: [number, number]): void {
    if (!range || range[0] === 0 && range[1] === 100) {
      this.userFilters.removeFilter(FILTERS.SEARCH_BY_PROGRESS_FILTER_ID);
    } else {
      this.userFilters.setFilter(getProgressFilter(range));
    }
  }


  updateStateFilter(states: Set<'a' | 'b' | 'c'>): void {
    if (!states || states.size === 0) {
      this.userFilters.removeFilter(FILTERS.STATE_FILTER_ID);
    } else {
      this.userFilters.setFilter(getStateFilter(states));
    }
  }

  updateSearchNameFilter(searchValue: string): void {
    if (!searchValue || searchValue.length === 0) {
      this.userFilters.removeFilter(FILTERS.SEARCH_BY_NAME_FILTER_ID);
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
