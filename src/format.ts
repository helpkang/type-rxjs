const start = Date.now();

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

export function getNull() {
  return { data: null, c: Date.now(), t: getFormatDate() };
}
