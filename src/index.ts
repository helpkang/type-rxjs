import { range, of, forkJoin, combineLatest, interval, Observable } from 'rxjs';
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

import { getFormatDate, getNull, Message } from './format'


const BETWEEN_MESSGE = 200;
const DELETE_MESSAGE_TIME = 300;



class MssageCreator {

  static create(): MssageCreator {
    return new MssageCreator();
  }

  private _message$: Observable<any>;

  get message$(): Observable<Message | null> {
    return this._message$;
  }

  private constructor() {
    this._message$ = range(1, 41)
      .pipe(
        //random data 생성
        concatMap((i) => {
          //마지막 데이터를 보기 위해서 무한정 긴 시간을 기다림
          if (i > 40) return of(i).pipe(delay(20000000));
          //random data 
          return of(i).pipe(delay(Math.random() * 400));
        }),
        startWith(null),
      )
      .pipe(
        //data에 시간 정보를 생성해서 넣음
        map((data: any): Message => ({ data, c: Date.now(), t: getFormatDate() })),
        //pair를 위해서 더미 데이터 생성
      )
      .pipe(
        pairwise(),
        // tslint:disable-next-line: no-console
        tap(([p, c]) => console.log(c)),
        //일정 시간동안 데이터 무시
        debounce(([p, c]) => {

          //처음 시작이거나 긴시간 동안 데이터가 없는 경우
          if (!p.data || c.c - p.c > BETWEEN_MESSGE) {
            return of(1);
          }

          // 현재 시간을 구해옴
          const cnow = Date.now();
          //현재 시간과 이전에 데이터 실행 시간동안 갭에서 무시할 시간 만큼을 개산
          return interval(BETWEEN_MESSGE - (cnow - p.c));
        }),
        map(([_, value]) => {
          // 현재 시간을 debounce 처리되고 남은 시간을 넣어 줌 (간견을 최소이상으로 맞추기)
          value.c = Date.now();
          return value
        }),
        //null로 닦아 주는 로직을 항상 메시지 넣어 주고 다음에 추가
        switchMap((value) => of(value, null)),
        //
        switchMap((value) => (value ? of(value) : of(value).pipe(delay(DELETE_MESSAGE_TIME)))),
        //필요 없는것 같지만 혹시나 해서 넣어 줌
        distinctUntilChanged(),
      )
  }
}


MssageCreator.create().message$.subscribe((val: Message | null) => {
  // tslint:disable-next-line: no-console
  console.log('receive:', getFormatDate(), val);
});
