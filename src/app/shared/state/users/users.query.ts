import { Injectable } from '@angular/core';
import { QueryEntity } from '@datorama/akita';
import {UsersStore, UsersState, UserViewModel} from './users.store';
import {map, startWith, switchMap} from 'rxjs/operators';
import {ProgressService} from '../progress/progress.service';
import {ProgressQuery} from '../progress/progress.query';

@Injectable({ providedIn: 'root' })
export class UsersQuery extends QueryEntity<UsersState> {

  constructor(protected store: UsersStore) {
    super(store);
  }
}

@Injectable({ providedIn: 'root' })
export class UsersWithProgressQuery extends QueryEntity<UsersState> {
  constructor(protected store: UsersStore,
              protected progressQuery: ProgressQuery,
              protected progressService: ProgressService) {
    super(store);
  }

  selectAll(): any {
    // note that it has a side-effect of reloading all the progress
    return super.selectAll().pipe(
      switchMap(users => this.progressService.get(users.map(({id}) => id))
        .pipe(
          startWith(users),
          switchMap(() => this.progressQuery.selectAll()
            .pipe(
              map(usersProgress => usersProgress
                .reduce((acc, {id, progress}) => ({...acc, [id]: progress}), {} as {[userId: string]: number})),
              map(progressMap => users.map(
                u => ({...u, progress: progressMap[u.id]} as UserViewModel))))))));
  }
}
