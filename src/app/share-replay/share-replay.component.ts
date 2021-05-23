import {AfterViewInit, Component, OnInit} from '@angular/core';
import {interval, NEVER} from 'rxjs';
import {share, shareReplay, startWith, tap} from 'rxjs/operators';

@Component({
  selector: 'app-share-replay',
  templateUrl: './share-replay.component.html',
  styleUrls: ['./share-replay.component.scss']
})
export class ShareReplayComponent implements OnInit {

  // will leak and base observable will be observable two time
  // i1$ = interval$.pipe(shareReplay(1));

  // will leak, but base observable will be executed once
  // i1$ = sharedReplayInterval$;

  // can potentially miss the first value
  // i1$ = simpleShare$;

  i1$ = shareReplay$;
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
  // i2$ = interval$.pipe(shareReplay(1));

  // will leak, see above
  // i2$ = sharedReplayInterval$;

  // i2$: any = simpleShare$;

  i2$ = shareReplay$;

  constructor() {

  }

  ngOnInit(): void {
    // same as ngAfterViewInit
    // this.i2$ = simpleShare$;
  }

  ngAfterViewInit(): void {
    // simpleshare$ will miss the emitted value, as it has been already consumed
  }
}

// using shareReplay in each component leave 2 subjects that would never unsubscribe
const interval$ = interval(2000).pipe(tap(a => console.log('BAES', a)));

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
