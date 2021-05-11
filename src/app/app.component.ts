import { Component } from '@angular/core';
import {UsersQuery} from './shared/state/users.query';
import {UsersService} from './shared/state/users.service';
import {UserQueryService} from './shared/state/progress.query';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private readonly query: UserQueryService, private readonly userService: UsersService) {

  }

  isCollapsed = false;
}
