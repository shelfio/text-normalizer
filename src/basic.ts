import {removeSymbols, removeSymbolsAndDiacritics} from './helpers';

export class BasicTextNormalizer {
  private clean: (s: string) => string;
  private splitLetters: boolean;

  constructor(removeDiacritics = false, splitLetters = false) {
    this.clean = removeDiacritics ? removeSymbolsAndDiacritics : removeSymbols;
    this.splitLetters = splitLetters;
  }

  public normalize(s: string): string {
    s = s.toLowerCase();
    s = s.replace(/<[^\]]*>|\[[^\]]*\]/g, ''); // remove words between brackets
    s = s.replace(/\(([^)]+?)\)/g, ''); // remove words between parenthesis
    s = this.clean(s).toLowerCase();

    if (this.splitLetters) {
      // @ts-ignore
      s = s
        .match(/[\s\S]/gu) // Split into an array of Unicode grapheme clusters
        .join(' '); // Join with spaces between clusters
    }

    s = s.replace(/\s+/g, ' '); // replace any successive whitespace characters with a space

    return s.trim();
  }
}
