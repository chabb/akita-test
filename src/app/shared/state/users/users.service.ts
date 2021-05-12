import { Injectable } from '@angular/core';
import { ID } from '@datorama/akita';
import { tap } from 'rxjs/operators';
import { UsersStore } from './users.store';
import {InMemoryApiService} from '../../in-memory-api/in-memory-api.service';
import {Observable} from 'rxjs';
import {User} from '../../in-memory-api/types';

@Injectable({ providedIn: 'root' })
export class UsersService {

  constructor(private usersStore: UsersStore, private api: InMemoryApiService) { }

  get(): Observable<User[]> {
    return this.api.getUsers().pipe(tap(entities => {
      this.usersStore.set(entities);
    }));
  }

  add(user: User): void {
    this.usersStore.add(user);
  }

  update(id: number, user: Partial<User>): void {
    this.usersStore.update(id, user);
  }

  remove(id: ID): void {
    this.usersStore.remove(id);
  }
}
