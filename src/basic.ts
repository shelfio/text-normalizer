import {removeSymbols, removeSymbolsAndDiacritics} from './helpers';

export class BasicTextNormalizer {
  private clean: (s: string) => string;

  constructor(removeDiacritics = false, splitLetters = false) {
    this.clean = removeDiacritics ? removeSymbolsAndDiacritics : removeSymbols;
    this.clean = this.clean.bind(this);

    if (splitLetters) {
      this.clean = (s: string) =>
        this.clean(s)
          .split('')
          .filter(c => c !== ' ')
          .join(' ');
      this.clean = this.clean.bind(this);
    }
  }

  public normalize(s: string): string {
    s = s.toLowerCase();
    s = s.replace(/<[^\]]*>|\[[^\]]*\]/g, ''); // remove words between brackets
    s = s.replace(/\(([^)]+?)\)/g, ''); // remove words between parenthesis
    s = this.clean(s).toLowerCase();
    s = s.replace(/\s+/g, ' '); // replace any successive whitespace characters with a space

    return s;
  }
}
