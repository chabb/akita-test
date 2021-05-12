import {Injectable, OnDestroy} from '@angular/core';
import * as faker from 'faker';
import {interval, Observable, range, Subject, timer} from 'rxjs';
import {map, mergeMap, shareReplay, switchMap, toArray} from 'rxjs/operators';
import {User, UserProgressEvent} from './types';
import {generateUser} from './utils';


@Injectable({
  providedIn: 'root'
})
export class InMemoryApiService implements OnDestroy {

  constructor() {
    this.generateUserTrigger.next();
  }

  generateUserTrigger = new Subject<void>();

  users$: Observable<User[]> = this.generateUserTrigger.pipe(
    mergeMap(() => range(0, 10 + faker.datatype.number(10)).pipe(
      map(_ => generateUser()),
      toArray(),
    )),
    shareReplay(1)
  );

  sub = this.users$.subscribe(a => console.log('User list genereated', a));

  public getUsers(): Observable<User[]> {
    return timer(500 + faker.datatype.number(1250)).pipe(
      switchMap(() => this.users$));
  }

  public getUsersProgress(userIds: number[]): Observable<UserProgressEvent[]> {
    return interval(850).pipe(
      map(a => userIds.map(id => ({id, progress: Math.random()})))
    );
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}

