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
  scan,
} from 'rxjs/operators';

import { getFormatDate, Message } from './format'

export {
  getFormatDate, Message
};


export interface MessageCreateOptions {
  log?: boolean;
  deleteMessageTime?: number

}

/**
 * 메시지 처리 
 */
export class MssageCreator {

  /**
   * 메시지 처리 생성자
   * sample :
   * const mc = MssageCreator.create({
   * log: true,
   * interMessageTime: 200,
   * deleteMessageTime: 300,
   * })
   * @param test test 용으로 생성할지 여부
   */
  static create(options: MessageCreateOptions): MssageCreator {

    return new MssageCreator({
      log: false,
      deleteMessageTime: 300,
      ...options
    });
  }

  private sb: Subject<Message | null>;

  private _message$: Observable<Message | null>;

  get message$(): Observable<Message | null> {
    return this._message$;
  }

  private constructor(options: MessageCreateOptions) {
    const { deleteMessageTime } = options;
    this.sb = new Subject<Message | null>();

    this._message$ = this.sb.pipe(
      //pair를 위해서 더미 데이터 생성
      // startWith(null),
    )
      .pipe(
        pairwise(),
        // tslint:disable-next-line: no-console
        //일정 시간동안 데이터 무시
        //null로 닦아 주는 로직을 항상 메시지 넣어 주고 다음에 추가
        delayWhen(([p, c]) => {

          const cnow = Date.now();

          if (!p) {
            return of(1);
          }

          //처음 시작이거나 긴시간 동안 데이터가 없는 경우
          if ((cnow - p.c) > deleteMessageTime) {
            c.c = cnow + 20;
            return of(1);
          }

          // 현재 시간을 구해옴
          //현재 시간과 이전에 데이터 실행 시간동안 갭에서 무시할 시간 만큼을 개산
          const cab = deleteMessageTime - (cnow - p.c)
          c.c = cnow + cab + 20
          return interval(cab);
        }),
        map(([_, value]) => {
          // 현재 시간을 debounce 처리되고 남은 시간을 넣어 줌 (간견을 최소이상으로 맞추기)
          // value.c = Date.now();
          return value
        }),
        // tap((v) => console.log(getFormatDate(), v)),
        switchMap((value) => of(value, null)),
        // switchMap((value) => (value ? of(value) : of(value).pipe(delay(options.deleteMessageTime)))),
        delayWhen(((value) => (value ? of(value) : interval(options.deleteMessageTime)))),
        // scan((sum, current) => {
        //   console.log('current', current)
        //   if (!current) of(null).pipe(delay(options.deleteMessageTime));
        //   return of(current)
        // }, null),
        // switchMap((value) => value),
        // delayWhen((value) => value ? interval(0) : interval(options.deleteMessageTime)),
        // switchMap((value) => (value ? of(value) : of(value).pipe(delay(options.deleteMessageTime)))),
        // tap(v => console.log(v)),
        share(),
      ) as Observable<Message>

  }

  public sendMessage(message: any) {
    //data에 시간 정보를 생성해서 넣음
    this.sb.next({ data: message, c: Date.now(), t: getFormatDate() });
  }
}


const mc = MssageCreator.create({
  log: true,
  deleteMessageTime: 300,

})

mc.message$
  .pipe(
  ).subscribe((val: Message | null) => {
    // tslint:disable-next-line: no-console
    console.log('receive::::', getFormatDate(), val);
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
