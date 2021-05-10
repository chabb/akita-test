import { Injectable } from '@angular/core';
import {combineQueries, QueryEntity} from '@datorama/akita';
import { UsersStore, UsersState } from './users.store';
import {map, switchMap} from 'rxjs/operators';
import {ProgressService} from './progress.service';
import {ProgressQuery} from './progress.query';
import {Observable} from 'rxjs';
import {UserWithProgress} from './types';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends QueryEntity<UsersState> {

  constructor(protected store: UsersStore,
              private progressQuery: ProgressQuery,
              private progressService: ProgressService) {
    super(store);
  }

  selectUsersWithProgress(): Observable<UserWithProgress[]> {
    return this.selectAll().pipe(
      switchMap(users => this.progressService.get(users.map(({id}) => id))
        .pipe(
          switchMap(() => this.progressQuery.selectAll()
            .pipe(
              map(usersProgress => usersProgress
                .reduce((acc, {id, progress}) => ({...acc, [id]: progress}), {} as {[userId: string]: number})),
              map(progressMap => users.map(u => ({...u, progress: progressMap[u.id]}))))))));
  }
}

