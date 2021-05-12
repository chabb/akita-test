import {Component, OnDestroy} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {UsersService} from '../../shared/state/users/users.service';
import {Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {UserViewModel} from '../../shared/state/users/users.store';
import {FILTERS, STATE_FILTERS} from '../../shared/state/filters';
import {UserQueryService} from '../../shared/state/users-query.service';


@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})

export class UserTableComponent implements OnDestroy {

  visible = false;

  private readonly initialStateFilter = (this.query.userFilters.getFilterValue(FILTERS.STATE_FILTER_ID)
    ? Array.from(this.query.userFilters.getFilterValue(FILTERS.STATE_FILTER_ID) as Set<string>)
    : [])
    .reduce((acc: any, v: string) => ({...acc, [v]: true}), {});
  readonly filterState = STATE_FILTERS.map(filter => ({...filter, byDefault: !!this.initialStateFilter[filter.value]}));

  readonly listOfData$ = this.query.getFilteredUsersWithProgress();

  readonly overallFilterControl = this.query.searchFilterControl();
  private readonly overallFilterSubs = this.overallFilterControl.valueChanges.subscribe(
    (v: string) => this.query.updateSearchFilter(v.trim()));

  readonly searchByNameControl = this.query.searchByNameControl();

  readonly searchAction$ = new Subject<string>();
  private readonly searchSub = this.searchAction$.pipe(
    tap(_ => this.visible = false),
  ).subscribe(searchValue => this.query.updateSearchNameFilter(searchValue));

  constructor(private readonly userService: UsersService,
              private readonly query: UserQueryService) {

    // fetch datas, complete once request is successful
    this.userService.get().subscribe();
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

  identityFn(idx: number, item: UserViewModel): number {
    return item.id;
  }

  ngOnDestroy(): void {
    this.searchSub.unsubscribe();
    this.overallFilterSubs.unsubscribe();
  }
}
