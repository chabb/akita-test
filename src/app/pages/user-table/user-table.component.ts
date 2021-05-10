import { Component, OnInit } from '@angular/core';
import {NzTableQueryParams} from 'ng-zorro-antd/table';
import {UsersService} from '../../state/users.service';
import {UserQueryService} from '../../state/progress.query';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})
export class UserTableComponent implements OnInit {

  filterState = [
    { text: 'a', value: 'a' },
    { text: 'b', value: 'b' },
    { text: 'c', value: 'c' },
    { text: 'd', value: 'd' },
  ];

  readonly listOfData$ = this.query.getFilteredUsersWithProgress();

  constructor(private readonly userService: UsersService,
              private readonly query: UserQueryService) {

    this.userService.get().subscribe();
  }

  ngOnInit(): void {}

  onQueryParamsChange(params: NzTableQueryParams): void {
    if (params.filter) {
      params.filter.forEach((filter) => {
        if (filter.key === 'state') {
          this.query.updateStateFilter(new Set(filter.value));
        }
      });
    }
  }
}
