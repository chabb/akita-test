import {Inject, Injectable} from '@angular/core';
import {UsersStore, UserViewModel} from './users/users.store';
import {ProgressService} from './progress/progress.service';
import {UsersQuery, UsersWithProgressQuery} from './users/users.query';
import {AkitaFilterBase, AkitaFilterLocal, AkitaFiltersPlugin} from 'akita-filters-plugin';
import {BehaviorSubject, combineLatest, iif, interval, merge, Observable, ObservedValueOf, of} from 'rxjs';
import {ProgressQuery} from './progress/progress.query';
import {FILTERS, getProgressFilter, getSearchFilter, getSearchOnNameFilter, getStateFilter, STATE_FILTERS} from './filters';
import {FormControl} from '@angular/forms';
import {FilterType} from './types';
import {distinctUntilChanged, map, repeat, share, shareReplay, switchMap, takeWhile, withLatestFrom} from 'rxjs/operators';
import {getEntityType, SortByOptions} from '@datorama/akita';
import {User} from '../in-memory-api/types';
import {ROTATION_INTERVAL_TOKEN} from '../../pages/maps/providers';

@Injectable({ providedIn: 'root' })
export class UserQueryService {

  readonly filterType$ = new BehaviorSubject<FilterType>(FilterType.REMOVE_ROW);
  // @ts-ignore :(
  readonly userFilters = new AkitaFiltersPlugin<UsersStore>(this.userWithProgressQuery);
  // @ts-ignore :(
  private readonly select$: Observable<UserViewModel[]> = this.filterType$.pipe(
    // @ts-ignore :(
    switchMap(filterType => iif(() => filterType === FilterType.REMOVE_ROW,
      this.userFilters.selectAllByFilters(),
      this.selectAndMarkFiltered()
    )),
    shareReplay({bufferSize: 1 , refCount: false}));

  private readonly userLength$ = this.getFilteredUsersWithProgress().pipe(
    map(a => a.length),
    distinctUntilChanged(),
  );

  // this will stay once subscribed
  readonly userRotation$ = merge(of(-1), interval(this.rotationInterval)).pipe(
    map(a => a + 1),
    withLatestFrom(this.userLength$),
    takeWhile(([currentUser, userLength]) => currentUser <= userLength, false),
    map(([i, _]) => i),
    repeat(),
    shareReplay({ bufferSize: 1, refCount: true}));

  // form controls helper
  readonly getStateFiltersAsObject = () => Array.from(
    this.userFilters.getFilterValue(FILTERS.STATE_FILTER_ID) as Set<string> ??
    []).reduce((acc: any, v: string) => ({...acc, [v]: true}), {})

  readonly getProgressFilterValue = () => this.userFilters.getFilterValue(FILTERS.SEARCH_BY_PROGRESS_FILTER_ID) ?? [0, 100];

  readonly searchFilterControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_FILTER_ID) ?? '');
  readonly searchByNameControl = () => new FormControl(this.userFilters.getFilterValue(FILTERS.SEARCH_BY_NAME_FILTER_ID) ?? '');
  readonly searchByStateControl = () => {
    const initialSelectedFilters = this.getStateFiltersAsObject();
    return new FormControl(STATE_FILTERS.map(({text, value}) => ({
      value,
      label: text,
      checked: initialSelectedFilters[value]})));
  }

  readonly searchByProgressControl = () => new FormControl(this.getProgressFilterValue());

  constructor(private readonly userStore: UsersStore,
              private readonly userWithProgressQuery: UsersWithProgressQuery,
              private readonly progressQuery: ProgressQuery,
              private readonly progressService: ProgressService,
              @Inject(ROTATION_INTERVAL_TOKEN) private readonly rotationInterval: number,
              private readonly userQuery: UsersQuery) {
  }

  isLoadingTable(): Observable<boolean> {
    return this.userQuery.selectLoading();
  }

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
    return this.select$;
  }

  // this mimicks filters plugin
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
