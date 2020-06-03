/*
    airportCode: 'CID',
    airportName: '시더래피즈, IA, 미국',
    spread: 'ㅅㅣㄷㅓㄹㅐㅍㅣㅈㅡ, IA, ㅁㅣㄱㅜㄱ',
    koEnglish: 'tlejfovlwm, IA, alrnr',
    choSung: 'ㅅㄷㄹㅍㅈ, IA, ㅁㄱ'
*/

const S_CHO = ['ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const S_JUNG = ['ㅏ', 'ㅐ', 'ㅑ', 'ㅒ', 'ㅓ', 'ㅔ', 'ㅕ', 'ㅖ', 'ㅗ', 'ㅘ', 'ㅙ', 'ㅚ', 'ㅛ', 'ㅜ', 'ㅝ', 'ㅞ', 'ㅟ', 'ㅠ', 'ㅡ', 'ㅢ', 'ㅣ'];
const C_JONG = ['', 'ㄱ', 'ㄲ', 'ㄳ', 'ㄴ', 'ㄵ', 'ㄶ', 'ㄷ', 'ㄹ', 'ㄺ', 'ㄻ', 'ㄼ', 'ㄽ', 'ㄾ', 'ㄿ', 'ㅀ', 'ㅁ', 'ㅂ', 'ㅄ', 'ㅅ', 'ㅆ', 'ㅇ', 'ㅈ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ'];
const KOR_KEYBOARD = 'ㄱㄲㄴㄷㄸㄹㅁㅂㅃㅅㅆㅇㅈㅉㅊㅋㅌㅍㅎㅏㅐㅑㅒㅓㅔㅕㅖㅗㅛㅜㅠㅡㅣ';
const ENG_KEYBORD = 'rRseEfaqQtTdwWczxvgkoiOjpuPhynbml';


const covertMap = (keys: string[], value: string[]): { [key: string]: string } => {
    const result: { [key: string]: string } = {};
    keys.forEach((key: string, index: number) => {
        result[key] = value[index];
    });
    return result;
}

const KOR_ENC_MAP = covertMap(KOR_KEYBOARD.split(''), ENG_KEYBORD.split(''));
const ENC_KOR_MAP = covertMap(ENG_KEYBORD.split(''), KOR_KEYBOARD.split(''));

// 초성, 중성, 종성을 풀어서 문자로 만들어 줌
const getKoToSpread = (str: string): string => {

    if (str === null) return null;

    const chars: string[] = [];

    for (let i = 0; i < str.length; i++) {
        let cCode = str.charCodeAt(i);

        // 한글이 아닌 경우 
        if (cCode < 0xAC00 || cCode > 0xD7A3) {
            chars.push(str.charAt(i));
            continue;
        }

        cCode -= 0xAC00;
        const jong = cCode % 28; // 종성 
        const tempcode = (cCode - jong) / 28;
        const jung = tempcode % 21; // 중성
        const cho = (tempcode - jung) / 21; // 초성 

        chars.push(S_CHO[cho], S_JUNG[jung]);
        if (C_JONG[jong] !== '') {
            chars.push(C_JONG[jong]);
        }
    }
    return chars.join('');
}

const getKoToChoSung = (str: string): string => {

    if (str === null) return null;

    const chars: string[] = [];

    for (let i = 0; i < str.length; i++) {
        let cCode = str.charCodeAt(i);

        // 한글이 아닌 경우 
        if (cCode < 0xAC00 || cCode > 0xD7A3) {
            chars.push(str.charAt(i));
            continue;
        }

        cCode -= 0xAC00;
        const jong = cCode % 28; // 종성 
        const tempcode = (cCode - jong) / 28;
        const jung = tempcode % 21; // 중성
        const cho = (tempcode - jung) / 21; // 초성 

        chars.push(S_CHO[cho]);
    }
    return chars.join('');
};

const getEncKeyboard = (str: string): string => {
    if (str === null) return null;

    const chars: string[] = [];

    for (let i = 0; i < str.length; i++) {
        const code = KOR_ENC_MAP[str.charAt(i)];
        chars.push(code ? code : str.charAt(i));
    }
    return chars.join('');
};



export const changeSearchList = (airports: any[]) => {

    return airports.map(
        (value) => {
            const { airportCode, airportName } = value;
            const spread = getKoToSpread(airportName);
            return {
                koEnglish: getEncKeyboard(spread),
                choSung: getKoToChoSung(airportName),
                ...value,
            };
        });
}

// console.log(list)
export const search = (list: any[], searchText: string): any[] => {
    const upperSearchText = searchText.toUpperCase();
    const lowerSearchText = searchText.toLocaleLowerCase();
    const result = list.filter((value) => {
        const { airportCode, airportName, koEnglish, choSung, cityCode } = value;
        return airportCode.includes(upperSearchText)
            || airportName.includes(upperSearchText)
            || koEnglish.includes(searchText)
            || choSung.includes(searchText)
            || cityCode.startsWith(lowerSearchText)
            ;

    });

    return result;
};













