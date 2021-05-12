import {Component, OnDestroy} from '@angular/core';
import {ID} from '@datorama/akita';
import {FormControl} from '@angular/forms';
import {map} from 'rxjs/operators';
import {merge} from 'rxjs';
import {FILTERS} from '../../shared/state/filters';
import {UserQueryService} from '../../shared/state/users-query.service';


interface CB {
  value: string;
  checked: boolean;
}

const A = {a: 1, b: 2};
@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})


export class FilterComponent implements OnDestroy {

  filters$ = this.query.userFilters.selectFilters();
  FILTERS = FILTERS;

  searchFilterControl = this.query.searchFilterControl();
  searchByNameControl = this.query.searchByNameControl();
  searchByStateControl = this.query.searchByStateControl();

  formSubscription = merge(...[
    this.searchFilterControl.valueChanges.pipe(map(value => ({value, id: FILTERS.SEARCH_FILTER_ID}))),
    this.searchByNameControl.valueChanges.pipe(map(value => ({value, id: FILTERS.SEARCH_BY_NAME_FILTER_ID}))),
    this.searchByStateControl.valueChanges.pipe(map(value => ({value, id: FILTERS.STATE_FILTER_ID})))]).subscribe(
    ({value, id}) => {
      switch (id) {
        case FILTERS.STATE_FILTER_ID: {
          this.query.updateStateFilter(new Set<'a' | 'b' | 'c'>(
            (value as CB[]).reduce((acc, {checked, value: v}) => {
              if (checked) {
                acc.push(v);
              }
              return acc;
            }, [] as any[])));
          break;
        }
        case FILTERS.SEARCH_BY_NAME_FILTER_ID: {
          this.query.updateSearchNameFilter(value);
          break;
        }
        case FILTERS.SEARCH_FILTER_ID: {
          this.query.updateSearchFilter(value);
          break;
        }
      }
    });

  constructor(private readonly query: UserQueryService) { }

  public filterIdentityFn(idx: number, filter: any): ID {
    return filter.id;
  }

  ngOnDestroy(): void {
    this.formSubscription.unsubscribe();
  }
}
