import {Component, OnDestroy} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {UsersService} from '../../shared/state/users/users.service';
import {Subject} from 'rxjs';
import {map, tap} from 'rxjs/operators';
import {UserViewModel} from '../../shared/state/users/users.store';
import {STATE_FILTERS} from '../../shared/state/filters';
import {UserQueryService} from '../../shared/state/users-query.service';
import {InMemoryApiService} from '../../shared/in-memory-api/in-memory-api.service';


@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})

export class UserTableComponent implements OnDestroy {

  // ui state
  visible = false;
  loading$ = this.query.isLoadingTable();

  // lists
  readonly listOfData$ = this.query.getFilteredUsersWithProgress();

  // filters
  private readonly initialStateFilter = this.query.getStateFiltersAsObject();
  readonly filterState = STATE_FILTERS.map(filter => ({...filter, byDefault: !!this.initialStateFilter[filter.value]}));

  readonly overallFilterControl = this.query.searchFilterControl();
  private readonly overallFilterSubs = this.overallFilterControl.valueChanges.subscribe(
    (v: string) => this.query.updateSearchFilter(v.trim()));

  readonly searchByNameControl = this.query.searchByNameControl();

  readonly progressFilterValue$ = this.query.userFilters.selectFilters().pipe(
    map(_ => this.query.getProgressFilterValue()));

  readonly searchAction$ = new Subject<string>();
  private readonly searchSub = this.searchAction$.pipe(
    tap(_ => this.visible = false),
  ).subscribe(searchValue => this.query.updateSearchNameFilter(searchValue));

  constructor(private readonly userService: UsersService,
              private readonly inMemoryApiService: InMemoryApiService,
              private readonly query: UserQueryService) {
    this.reload();
  }

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (params.filter) {
      params.filter.forEach((filter) => {
        if (filter.key === 'state') {
          this.query.updateStateFilter(new Set(filter.value));
        }
      });
    }
  }

  reload(): void {
    // fetch datas, complete once request is successful
    // handle error state here if you want to do it locally
    this.userService.get().subscribe();
  }

  regenerate(): void {
    this.inMemoryApiService.generateUserTrigger.next();
  }

  identityFn(idx: number, item: UserViewModel): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
    this.overallFilterSubs.unsubscribe();
  }
}
