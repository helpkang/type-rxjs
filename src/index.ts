import { range, of, forkJoin, combineLatest, interval, Observable, Subject, defer, empty, never, throwError, from, Scheduler, animationFrameScheduler } from 'rxjs';
import {
  concat,
  merge,
  share,
  mapTo,
  delay,
  tap,
  timeInterval,
  timeout,
  delayWhen,
  switchMap,
  map,
  switchMapTo,
  repeat,
  concatMap,
  debounceTime,
  debounce,
  skip,
  distinctUntilChanged,
  mergeMap,
  pairwise,
  startWith,
  throttle,
  mergeAll,
  concatAll,
  combineAll,
  filter,
  take,

} from 'rxjs/operators';
import { observeOn, } from 'rxjs/operators';

const intervals = interval(10);                // Intervals are scheduled
// with async scheduler by default...
intervals.pipe(
  observeOn(animationFrameScheduler),
  take(100),    // ...but we will observe on animationFrame
)                                              // scheduler to ensure smooth animation.
  .subscribe(val => {
    console.log(val + 'px');
  });