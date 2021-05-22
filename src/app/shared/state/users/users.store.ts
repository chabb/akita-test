import { Injectable } from '@angular/core';
import { EntityState, EntityStore, StoreConfig } from '@datorama/akita';
import {UserWithProgress} from '../types';
import {User} from '../../in-memory-api/types';

type Diff<T, U> = T extends U ? never : T;
type RequiredExceptFor<T, TOptional extends keyof T> = Pick<T, Diff<keyof T, TOptional>> & Partial<T>;

export type UserViewModel = RequiredExceptFor<UserWithProgress, 'progress'> & { filtered?: boolean};

export interface UsersState extends EntityState<User> {}

@Injectable({ providedIn: 'root' })
@StoreConfig({ name: 'users' })
export class UsersStore extends EntityStore<UsersState> {

  constructor() {
    super();
  }
}
