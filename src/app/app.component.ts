import {Component} from '@angular/core';
import {UserQueryService} from './shared/state/users-query.service';
import {FilterType} from './shared/state/types';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  title = 'app-reactive';

  constructor(private readonly userqueryService: UserQueryService) {}
  isCollapsed = false;

  onSwitchChanged(value: boolean): void {
    this.userqueryService.filterType$.next(
      value ? FilterType.GRAY_ROW : FilterType.REMOVE_ROW
    );
  }
}
