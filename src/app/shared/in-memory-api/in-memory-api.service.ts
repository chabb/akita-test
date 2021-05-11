import { Injectable } from '@angular/core';
import * as faker from 'faker';
import {interval, Observable, range, timer} from 'rxjs';
import {map, switchMap, toArray} from 'rxjs/operators';
import {User, UserProgressEvent} from './types';
import {generateUser} from './utils';


@Injectable({
  providedIn: 'root'
})
export class InMemoryApiService {

  constructor() { }

  public getUsers(): Observable<User[]> {
    return timer(500 + faker.datatype.number(2000)).pipe(
      switchMap(a => range(0, 10)
        .pipe(map(_ => generateUser()), toArray()))
      );
  }

  public getUsersProgress(userIds: number[]): Observable<UserProgressEvent[]> {
    return interval(1000).pipe(
      map(a => userIds.map(id => ({id, progress: Math.random()})))
    );
  }
}

