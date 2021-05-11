import {Component, OnDestroy, OnInit} from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {UsersService} from '../../state/users.service';
import {SEARCH_BY_NAME_FILTER_ID, UserQueryService} from '../../state/progress.query';
import {FormControl} from '@angular/forms';
import {Subject} from 'rxjs';
import {tap} from 'rxjs/operators';
import {UserViewModel} from '../../state/users.store';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnDestroy {

  visible = false;

  readonly filterState = [
    { text: 'a', value: 'a' },
    { text: 'b', value: 'b' },
    { text: 'c', value: 'c' },
    { text: 'd', value: 'd' },
  ];

  readonly listOfData$ = this.query.getFilteredUsersWithProgress();

  readonly overallFilterControl = new FormControl(this.query.userFilters.getFilterValue(SEARCH_BY_NAME_FILTER_ID) ?? '');
  private readonly overallFilterSubs = this.overallFilterControl.valueChanges.subscribe((v) => {
    this.query.updateSearchFilter(v.trim());
  });

  readonly searchByNameControl = new FormControl(this.query.userFilters.getFilterValue(SEARCH_BY_NAME_FILTER_ID) ?? '');
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
