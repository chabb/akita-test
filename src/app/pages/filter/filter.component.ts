import {Component, OnDestroy} from '@angular/core';
import {FILTERS, UserQueryService} from '../../shared/state/progress.query';
import {ID} from '@datorama/akita';
import {FormControl} from '@angular/forms';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy {

  filters$ = this.query.userFilters.selectFilters();
  FILTERS = FILTERS;

  searchFilterControl = new FormControl(this.query.userFilters.getFilterValue(FILTERS.SEARCH_FILTER_ID));
  searchByNameControl = new FormControl(this.query.userFilters.getFilterValue(FILTERS.SEARCH_BY_NAME_FILTER_ID));
  searchByStateControl = new FormControl(Array.from(this.query.userFilters.getFilterValue(FILTERS.STATE_FILTER_ID) ??
    []));

  constructor(private readonly query: UserQueryService) { }

  public filterIdentityFn(idx: number, filter: any): ID {
    return filter.id;
  }

  ngOnDestroy(): void { }
}
