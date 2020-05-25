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

import { getFormatDate, Message } from './format'

export {
  getFormatDate, Message
};


export interface MessageCreateOptions {
  log?: boolean;
  interMessageTime?: number;
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
      interMessageTime: 2000,
      deleteMessageTime: 3000,
      ...options
    });
  }

  private sb: Subject<Message | null>;

  private _message$: Observable<Message | null>;

  get message$(): Observable<Message | null> {
    return this._message$;
  }

  private constructor(options: MessageCreateOptions) {
    this.sb = new Subject<Message | null>();

    this._message$ = this.sb.pipe(
      //pair를 위해서 더미 데이터 생성
      startWith(null),
    )
      .pipe(
        pairwise(),
        // tslint:disable-next-line: no-console
        tap(([p, c]) => options.log ? console.log(c) : null),
        //일정 시간동안 데이터 무시
        debounce(([p, c]) => {

          //처음 시작이거나 긴시간 동안 데이터가 없는 경우
          if (!p || c.c - p.c > options.interMessageTime) {
            return of(1);
          }

          // 현재 시간을 구해옴
          const cnow = Date.now();
          //현재 시간과 이전에 데이터 실행 시간동안 갭에서 무시할 시간 만큼을 개산
          return interval(options.interMessageTime - (cnow - p.c));
        }),
        map(([_, value]) => {
          // 현재 시간을 debounce 처리되고 남은 시간을 넣어 줌 (간견을 최소이상으로 맞추기)
          value.c = Date.now();
          return value
        }),
        //null로 닦아 주는 로직을 항상 메시지 넣어 주고 다음에 추가
        switchMap((value) => of(value, null)),
        //
        switchMap((value) => (value ? of(value) : of(value).pipe(delay(options.deleteMessageTime)))),
        //필요 없는것 같지만 혹시나 해서 넣어 줌
        distinctUntilChanged(),
        share(),
      ) as Observable<Message>

  }

  public sendMessage(message: any) {
    //data에 시간 정보를 생성해서 넣음
    this.sb.next(({ data: message, c: Date.now(), t: getFormatDate() }));
  }
}
