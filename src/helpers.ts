// @ts-ignore
import {getCategory} from 'unicode-properties';

type AdditionalDiacritics = {
  [key: string]: string;
};

const additionalDiacritics: AdditionalDiacritics = {
  œ: 'oe',
  Œ: 'OE',
  ø: 'o',
  Ø: 'O',
  æ: 'ae',
  Æ: 'AE',
  ß: 'ss',
  ẞ: 'SS',
  đ: 'd',
  Đ: 'D',
  ð: 'd',
  Ð: 'D',
  þ: 'th',
  Þ: 'th',
  ł: 'l',
  Ł: 'L',
};

export function removeSymbolsAndDiacritics(s: string, keep = ''): string {
  return Array.from(s.normalize('NFKD'))
    .map(c => {
      if (keep.includes(c)) {
        return c;
      } else if (additionalDiacritics[c]) {
        return additionalDiacritics[c];
      } else if (getCategory(c) === 'Mn') {
        return '';
      } else if (['M', 'S', 'P'].includes(getCategory(c)[0])) {
        return ' ';
      } else {
        return c;
      }
    })
    .join('');
}

export function removeSymbols(s: string): string {
  const regexMsp = /[^\p{L}\p{N}]/gu; // match any symbol or punctuation

  return s.replace(regexMsp, ' ');
}
export function windowed<T>(arr: T[], size: number): T[][] {
  const result = [];
  for (let i = 0; i < arr.length - size + 1; i++) {
    result.push(arr.slice(i, i + size));
  }

  return result;
}
