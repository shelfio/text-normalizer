import mapping from './english-mapping';

export class EnglishSpellingNormalizer {
  private mapping: {[key: string]: string};

  constructor() {
    this.mapping = mapping;
  }

  normalize(s: string): string {
    return s
      .split(' ')
      .map(word => this.mapping[word] || word)
      .join(' ');
  }
}
