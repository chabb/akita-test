import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {UsersStore, UsersState, UserViewModel} from './users.store';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends QueryEntity<UsersState> {

  constructor(protected store: UsersStore) {
    super(store);
  }
}
