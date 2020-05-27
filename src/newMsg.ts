import { range, of, Observable, Subject, merge } from 'rxjs';
import {
  concat,
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
  switchAll,
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
      deleteMessageTime: 3000,
      ...options
    });
  }

  private _sb: Subject<Message | null>;

  private _message$: Observable<Message | null>;

  get message$(): Observable<Message | null> {
    return this._message$;
  }

  private constructor(private options: MessageCreateOptions) {
    const { deleteMessageTime, log } = options;

    this._sb = new Subject<Message | null>();

    this._message$ = this._sb.pipe(
      //pair를 위해서 더미 데이터 생성
      // startWith(null),
    )
      .pipe(
        map(v => merge(of(v), of(null).pipe(delay(300))).pipe()),
        concatAll(),
        share(),
      ) as Observable<Message>

  }

  public sendMessage(message: any) {
    //로그모드 일때
    if (this.options.log) {
      //data에 시간 정보를 생성해서 넣음
      this._sb.next({ data: message, c: Date.now(), t: getFormatDate() });
      return;
    }
    this._sb.next(message);

  }
}


const mc = MssageCreator.create({
  log: false,
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
      return of(i).pipe(delay(Math.random() * 1600));
    }),
  )

  .subscribe((v) => {
    mc.sendMessage(v);
  })
