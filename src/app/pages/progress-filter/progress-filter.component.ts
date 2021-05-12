import {Component, OnDestroy} from '@angular/core';
import {UserQueryService} from '../../shared/state/users-query.service';
import { NzMarks } from 'ng-zorro-antd/slider';
import { marks } from './utils';

@Component({
  selector: 'app-progress-filter',
  templateUrl: './progress-filter.component.html',
  styleUrls: ['./progress-filter.component.scss']
})
export class ProgressFilterComponent implements OnDestroy {

  readonly marks: NzMarks = marks;

  readonly progressControl = this.query.searchByProgressControl();
  private readonly subscription = this.progressControl.valueChanges.subscribe((v: [number, number]) =>
    this.query.updateProgressFilter(v));

  constructor(private readonly query: UserQueryService) { }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
