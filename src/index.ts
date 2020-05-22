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

const start = Date.now();

// const clear$ = interval(500).pipe(
//     mapTo('clear')
// );

function getFormatDate() {
  const secnum = Date.now() - start;
  let minutes: any = Math.floor((secnum % (1000 * 60 * 60)) / (1000 * 60));
  let seconds: any = Math.floor((secnum % (1000 * 60)) / 1000);
  let miliseconds: any = secnum % 1000;

  if (minutes < 10) {
    minutes = '0' + minutes;
  }
  if (seconds < 10) {
    seconds = '0' + seconds;
  }
  if (miliseconds < 10) {
    miliseconds = '00' + miliseconds;
  } else if (miliseconds < 100) {
    miliseconds = '0' + miliseconds;
  }

  return minutes + ':' + seconds + '.' + miliseconds;
}

range(1, 20)
  .pipe(
    concatMap((i) => of(i).pipe(delay(50 + Math.random() * 2000))),
    map((i) => ({ i, c: Date.now(), t: getFormatDate() })),
  )
  .pipe(startWith(null))
  .pipe(
    pairwise(),
    // tap(console.log),
    debounce(([p, c]) =>
      !p || !c ? of(1) : c['c'] - p['c'] > 200 ? of(1) : interval(1000),
    ),
    map(([_, value]) => value),
    // map(([_, value]) => ({ ...value, l: Date.now() })),
    switchMap((value) => of(value, null)),
    switchMap((value) => (value ? of(value) : of(value).pipe(delay(1000)))),
  )
  .pipe()
  .subscribe((val) => {
    // tslint:disable-next-line: no-console
    console.log('receive:', getFormatDate(), val);
  });
