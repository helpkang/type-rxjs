import { range, of, forkJoin, combineLatest, interval, Observable, Subject } from 'rxjs';
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
} from 'rxjs/operators';

import { MssageCreator, getFormatDate, Message } from "./index";

const mc = MssageCreator.create({
  log: true,
  interMessageTime: 200,
  deleteMessageTime: 300,

})

mc.message$
  .pipe(
    // filter((v: Message) => {
    //   const b = !v || !v['data'] || v['data'] % 2 === 1;
    //   return b;
    // }),
  ).subscribe((val: Message | null) => {
    // tslint:disable-next-line: no-console
    console.log('receive:', getFormatDate(), val);
  });


range(1, 41)
  .pipe(
    //random data 생성
    concatMap((i) => {
      //마지막 데이터를 보기 위해서 무한정 긴 시간을 기다림
      if (i > 40) return of(i).pipe(delay(20000000));
      //random data 
      return of(i).pipe(delay(Math.random() * 400));
    }),
  )

  .subscribe((v) => {
    mc.sendMessage(v);
  })
