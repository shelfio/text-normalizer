import {removeSymbolsAndDiacritics} from './helpers';
import {EnglishSpellingNormalizer} from './english-spelling';
import {EnglishNumberNormalizer} from './english-number';

export class EnglishTextNormalizer {
  private ignorePatterns: RegExp;
  private replacers: Map<string, RegExp>;
  private standardizeNumbers: EnglishNumberNormalizer;
  private standardizeSpellings: EnglishSpellingNormalizer;

  constructor() {
    this.ignorePatterns = /\b(hmm|mm|mhm|mmm|uh|um)\b/g;
    this.replacers = new Map([
      ['will not', /\bwon't\b/g],
      ['can not', /\bcan't\b/g],
      ['let us', /\blet's\b/g],
      ['aint', /\bain't\b/g],
      ['you all', /\by'all\b/g],
      ['want to', /\bwanna\b/g],
      ['got to', /\bgotta\b/g],
      ['going to', /\bgonna\b/g],
      ['i am going to', /\bi'ma\b/g],
      ['i am going to', /\bimma\b/g],
      ['would have', /\bwoulda\b/g],
      ['could have', /\bcoulda\b/g],
      ['should have', /\bshoulda\b/g],
      ['madam', /\bma'am\b/g],
      ['mister ', /\bmr\b/g],
      ['missus ', /\bmrs\b/g],
      ['saint ', /\bst\b/g],
      ['doctor ', /\bdr\b/g],
      ['professor ', /\bprof\b/g],
      ['captain ', /\bcapt\b/g],
      ['governor ', /\bgov\b/g],
      ['alderman ', /\bald\b/g],
      ['general ', /\bgen\b/g],
      ['senator ', /\bsen\b/g],
      ['representative ', /\brep\b/g],
      ['president ', /\bpres\b/g],
      ['reverend ', /\brev\b/g],
      ['honorable ', /\bhon\b/g],
      ['assistant ', /\basst\b/g],
      ['associate ', /\bassoc\b/g],
      ['lieutenant ', /\blt\b/g],
      ['colonel ', /\bcol\b/g],
      ['junior ', /\bjr\b/g],
      ['senior ', /\bsr\b/g],
      ['esquire ', /\besq\b/g],
      [' had been', /'d been\b/g],
      [' has been', /'s been\b/g],
      [' had gone', /'d gone\b/g],
      [' has gone', /'s gone\b/g],
      [' had done', /'d done\b/g],
      [' has got', /'s got\b/g],
      [' not', /n't\b/g],
      [' are', /'re\b/g],
      [' is', /'s\b/g],
      [' would', /'d\b/g],
      [' will', /'ll\b/g],
      [' not', /'t\b/g],
      [' have', /'ve\b/g],
      [' am', /'m\b/g],
    ]);
    this.standardizeNumbers = new EnglishNumberNormalizer(); // Assuming this class exists
    this.standardizeSpellings = new EnglishSpellingNormalizer();
  }

  normalize(s: string): string {
    s = s.toLowerCase();

    s = s.replace(/<[^\]]*>/g, ''); // remove words between brackets
    s = s.replace(/\(([^)]+?)\)/g, ''); // remove words between parenthesis
    s = s.replace(this.ignorePatterns, '');
    s = s.replace(/\s+'/g, "'"); // standardize when there's a space before an apostrophe

    for (const [replacement, pattern] of this.replacers.entries()) {
      s = s.replace(pattern, replacement);
    }

    s = s.replace(/(\d),(\d)/g, '$1$2'); // remove commas between digits
    s = s.replace(/\.([^0-9]|$)/g, ' $1'); //remove periods not followed by numbers
    s = removeSymbolsAndDiacritics(s, '.%$¢€£'); // keep some symbols for numerics

    s = this.standardizeNumbers.normalize(s);
    s = this.standardizeSpellings.normalize(s);

    s = s.replace(/[.$¢€£]([^0-9])/g, ' $1');
    s = s.replace(/([^0-9])%/g, '$1 ');
    s = s.replace(/\s+/g, ' ').trim();

    return s;
  }
}
