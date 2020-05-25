const start = Date.now();

/**
 * 처리 메시지
 * 
 */
export interface Message {
  /**
   * creation time millisecond
   */
  c: number,
  /**
   * 최초 로딩 부터 걸린 시간 MM.SS.sss
   */
  t: string,
  /**
   * 오류 처리 메시지
   */
  data: any,
}

/**
 * 최초 로딩 부터 걸린 시간 MM.SS.sss 문자열 생성
 */
export function getFormatDate() {
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

/**
 * 최초 null data 생성
 */
export function getNull(): Message {
  return { data: null, c: Date.now(), t: getFormatDate() };
}
