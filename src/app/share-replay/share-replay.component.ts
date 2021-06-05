import {AfterViewInit, Component, OnInit} from '@angular/core';
import {interval, NEVER} from 'rxjs';
import {finalize, share, shareReplay, startWith, tap} from 'rxjs/operators';

@Component({
  selector: 'app-share-replay',
  templateUrl: './share-replay.component.html',
  styleUrls: ['./share-replay.component.scss']
})
export class ShareReplayComponent implements OnInit {

  // will leak, we are sharing for 'upcoming' observables
  // i1$ = interval$.pipe(shareReplay(1));

  // base observable will be not unsubscribed
  /*i1$ = sharedReplayInterval$.pipe(
    finalize(() => console.log('outer completed')),
    tap(a => console.log('inside the outer component')));*/

  // can potentially miss the first value
  i1$ = simpleShare$.pipe(finalize(() => console.log('outer completed')),
       tap(a => console.log('inside the outer component')));

  // i1$ = shareReplay$.pipe(finalize(() => console.log('outer completed')),
  //   //     tap(a => console.log('inside the outer component')));
  constructor() { }

  ngOnInit(): void {
  }
}

@Component({
  selector: 'app-share-inner-replay',
  templateUrl: './share-replay-inner.component.html',
  styleUrls: ['./share-replay.component.scss']
})
export class ShareReplayInnerComponent implements OnInit, AfterViewInit {

  // will leak
  // i2$ = interval$.pipe(finalize(() => console.log('completed')), shareReplay(1));

  // will not leak, but timer will not be restarted
  // i2$ = sharedReplayInterval$.pipe(
  //  finalize(() => console.log('inner completed')),
  //  tap(a => console.log('inside the inner component')));

  i2$ = simpleShare$;

  // i2$ = shareReplay$;

  constructor() { }

  ngOnInit(): void {
    // same as ngAfterViewInit
    // this.i2$ = simpleShare$;
  }

  ngAfterViewInit(): void {
    // simpleshare$ will miss the emitted value, as it has been already consumed
  }
}

// using shareReplay in each component leave 2 subjects that would never unsubscribe
const interval$ =
  interval(2000).pipe(
    finalize(() => console.log('completed')),
    tap(a => console.log('BASE OBSERVABLE', a)));

const sharedReplayInterval$ = interval$.pipe(
  shareReplay(1));

const simpleShare$ = interval$.pipe(
  startWith(9999),
  share()
);

const shareReplay$ = interval$.pipe(
  startWith(9999),
  shareReplay({bufferSize: 1, refCount: true})
);
