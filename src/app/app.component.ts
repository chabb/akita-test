import { Component } from '@angular/core';
import {UsersQuery} from './state/users.query';
import {UsersService} from './state/users.service';
import {UserQueryService} from './state/progress.query';

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
