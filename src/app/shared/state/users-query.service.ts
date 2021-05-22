import {Injectable} from '@angular/core';
import {UsersStore, UserViewModel} from './users/users.store';
import {ProgressService} from './progress/progress.service';
import {UsersQuery, UsersWithProgressQuery} from './users/users.query';
import {AkitaFilterBase, AkitaFilterLocal, AkitaFiltersPlugin} from 'akita-filters-plugin';
import {BehaviorSubject, combineLatest, iif, Observable, ObservedValueOf} from 'rxjs';
import {ProgressQuery} from './progress/progress.query';
import {FILTERS, getProgressFilter, getSearchFilter, getSearchOnNameFilter, getStateFilter, STATE_FILTERS} from './filters';
import {FormControl} from '@angular/forms';
import {FilterType} from './types';
import {map, switchMap} from 'rxjs/operators';
import {getEntityType, SortByOptions} from '@datorama/akita';
import {User} from '../in-memory-api/types';

@Injectable({ providedIn: 'root' })
export class UserQueryService {
  userFilters;

  filterType$ = new BehaviorSubject<FilterType>(FilterType.REMOVE_ROW);

  constructor(private userStore: UsersStore,
              private userWithProgressQuery: UsersWithProgressQuery,
              private progressQuery: ProgressQuery,
              private progressService: ProgressService,
              private userQuery: UsersQuery) {
    // @ts-ignore :(
    this.userFilters = new AkitaFiltersPlugin<UsersStore>(this.userWithProgressQuery);
  }

  isLoadingTable(): Observable<boolean> {
    return this.userQuery.selectLoading();
  }

  // form controls helper

  getStateFiltersAsObject = () => Array.from(
    this.userFilters.getFilterValue(FILTERS.STATE_FILTER_ID) as Set<string> ??
    []).reduce((acc: any, v: string) => ({...acc, [v]: true}), {})

  getProgressFilterValue = () => this.userFilters.getFilterValue(FILTERS.SEARCH_BY_PROGRESS_FILTER_ID) ?? [0, 100];

  searchFilterControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_FILTER_ID) ?? '');
  searchByNameControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_BY_NAME_FILTER_ID) ?? '');
  searchByStateControl = () => {
    const initialSelectedFilters = this.getStateFiltersAsObject();
    return new FormControl(STATE_FILTERS.map(({text, value}) => ({
      value,
      label: text,
      checked: initialSelectedFilters[value]})));
  }

  searchByProgressControl = () => new FormControl(this.getProgressFilterValue());

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
    const select$: Observable<UserViewModel[]> = this.filterType$.pipe(
      // @ts-ignore :(
      switchMap(filterType => iif(() => filterType === FilterType.REMOVE_ROW,
          this.userFilters.selectAllByFilters(),
          this.selectAndMarkFiltered()
        )));
    this.userFilters.selectAllByFilters();
    return select$;
  }

  private selectAndMarkFiltered(): Observable<Array<UserViewModel>> {
    const listObservable: Array<Observable<any>> = [];
    const filters$ = this.userFilters.filtersQuery.selectAll({sortBy: 'order'});
    const list$ = this.userFilters.getQuery().selectAll();
    // @ts-ignore, private fields access
    const refresh$ = this.userFilters._refresh$;
    const sortBy$ = this.userFilters.selectSortBy();

    listObservable.push(filters$, list$, refresh$, sortBy$);
    return combineLatest(listObservable).pipe(
      map((values) => {
        const [filters, entities, refresh, sort ] = values;
        const unkNowEntity: unknown = entities;
        return this._applyFiltersForArray((unkNowEntity as Array<UserViewModel>), filters, sort);
      }),
    );
  }

  private _applyFiltersForArray(
    entities: Array<UserViewModel>,
    filters: Array<AkitaFilterBase<any>>,
    sort: ObservedValueOf<Observable<SortByOptions<any> | null>>): Array<UserViewModel> {
    let entitiesFiltered = entities;
    if (filters.length !== 0) {
      entitiesFiltered = entities.map((entity: UserViewModel, index: number, array: Array<UserViewModel>) => {
        const isPassingFilter = filters.every((filter: AkitaFilterBase<UserViewModel>) => {
            return !!(filter as AkitaFilterLocal<UserViewModel>).predicate(entity, index, array, filter);
        });
        return { ...entity, filtered: !isPassingFilter};
      });
    }

    // TODO: implement sorting
    return entitiesFiltered;
  }
}
