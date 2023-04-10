import {removeDiacritics} from 'modern-diacritics';

export function removeSymbolsAndDiacritics(s: string, keep = ''): string {
  const stringWithoutDiacritics = removeDiacritics(s);

  return Array.from(stringWithoutDiacritics)
    .map(c => {
      if (keep.includes(c)) {
        return c;
      }

      return removeSymbols(c);
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
