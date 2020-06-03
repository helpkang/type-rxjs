import { changeSearchList, search } from './search';



const fs = require('fs');

let rawdata = fs.readFileSync('airports.json');
const airports = JSON.parse(rawdata);

const airportsList2 = changeSearchList(airports.airportList);

const searchWrapper = (list: any[], text: string) => {
    const result = search(list, text);

    console.log(text + ':result', result);

    return result;
}

//한글에 대한 풀어쓰기 초성 처리
let searchText = "인천";

let result = searchWrapper(airportsList2, searchText);



searchText = "ICN";

result = searchWrapper(airportsList2, searchText);


searchText = "icn";

result = searchWrapper(airportsList2, searchText);

searchText = "dlscj";

result = searchWrapper(airportsList2, searchText);

searchText = "ㅇㅊ";

result = searchWrapper(airportsList2, searchText);


searchText = "sel";

result = searchWrapper(airportsList2, searchText);

//filter 


/*
    airportCode: 'CID',
    airportName: '시더래피즈, IA, 미국',
    spread: 'ㅅㅣㄷㅓㄹㅐㅍㅣㅈㅡ, IA, ㅁㅣㄱㅜㄱ',
    koEnglish: 'tlejfovlwm, IA, alrnr',
    choSung: 'ㅅㄷㄹㅍㅈ, IA, ㅁㄱ'
*/













