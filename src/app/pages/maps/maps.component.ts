import {AfterViewInit, Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {UserQueryService} from '../../shared/state/users-query.service';
import {
  distinctUntilChanged,
  filter,
  map,
  repeat, share, shareReplay,
  takeWhile,
  tap,
  withLatestFrom
} from 'rxjs/operators';
import {InMemoryApiService} from '../../shared/in-memory-api/in-memory-api.service';
import {UsersService} from '../../shared/state/users/users.service';
import {interval, merge, Observable, of} from 'rxjs';
import {userMapper} from './globe-component/utils';
import {ROTATION_INTERVAL_TOKEN} from './providers';

@Component({
  selector: 'app-maps',
  templateUrl: './maps.component.html',
  styleUrls: ['./maps.component.scss']
})
export class MapsComponent implements OnInit, OnDestroy, AfterViewInit {

  type: any = 'roadmap';

  // using shareReplay with refCount set to false cause a memory leak
  // why share does not ? because share has refCount set to true by defaut,
  // but shareReplay has it set to false by defaut

  readonly base$ = this.userQueryService.getFilteredUsersWithProgress().pipe(
    distinctUntilChanged((a, b) =>
      JSON.stringify(a.map(ua => ua.name)) === JSON.stringify(b.map(ub => ub.name))),
    // tap(a => console.log('BASE', a)), // try to put tap after share :)
    shareReplay({bufferSize: 1, refCount: true}));

  readonly userPositions$: Observable<{ lat: number, lng: number }[]> = this.base$.pipe(
    map(users => users.map(({longitude, latitude}) => ({
      lat: Number.parseInt(latitude, 10),
      lng: Number.parseInt(longitude, 10)
    }))),
    // the issue is that new values are emitted because progress value changed
    // tap(a => { console.log('STREAM', a); }),
    shareReplay({bufferSize: 1, refCount: true}));


  readonly topojsonusers$ = this.base$.pipe(
    map(users => userMapper(users)),
    // tap(a => console.log('---------', a)),
  );

  private readonly userLength$ = this.userPositions$.pipe(
    map(a => a.length),
    distinctUntilChanged()
  );

  private readonly userRotation$ = merge(of(-1), interval(this.rotationInterval)).pipe(
    map(a => a + 1),
    withLatestFrom(this.userLength$),
    takeWhile(([currentUser, userLength]) => currentUser <= userLength, false),
    map(([i, _]) => i),
    repeat());

  readonly center$ = this.userRotation$.pipe(
    withLatestFrom(this.userPositions$),
    filter(([_, a]) => a.length > 0), // no rotation if no users
    tap(a => console.log('center', a)),
    map(([userIndex, users]) => users[userIndex]),
    filter(a => !!a),
    share());

  readonly lng$ = this.center$.pipe(map(c => c.lng));
  readonly lat$ = this.center$.pipe(map(c => c.lat));

  constructor(private readonly userQueryService: UserQueryService,
              private readonly inMemoryService: InMemoryApiService,
              private readonly userService: UsersService,
              @Inject(ROTATION_INTERVAL_TOKEN) private readonly rotationInterval: number
              ) {
    this.userService.get().subscribe();
  }

  regenerate(): void {
    this.inMemoryService.generateUserTrigger.next();
    this.userService.get().subscribe();
  }

  ngOnDestroy(): void {
  }

  ngOnInit(): void {}

  ngAfterViewInit(): void {
  }
}
