import { range, of, forkJoin, combineLatest, interval } from 'rxjs';
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
} from 'rxjs/operators';

import { getFormatDate, getNull } from './format'


range(1, 41)
  .pipe(
    concatMap((i) => {
      if (i > 40) return of(i).pipe(delay(20000000));
      return of(i).pipe(delay(Math.random() * 400));
    }),

  )
  .pipe(
    map((data) => ({ data, c: Date.now(), t: getFormatDate() })),
    startWith((getNull())),
  )
  .pipe(
    pairwise(),
    tap(([p, c]) => console.log(c)),
    debounce(([p, c]) =>
      !p.data || !c.data ? of(1) : c.c - p.c > 100 ? of(1) : interval(100),
    ),
    map(([_, value]) => value),
    switchMap((value) => of(value, null)),
    switchMap((value) => (value ? of(value) : of(value).pipe(delay(300)))),
  )
  .subscribe((val) => {
    // tslint:disable-next-line: no-console
    console.log('receive:', getFormatDate(), val);
  });
