import path from 'path';
import fs from 'fs';

export class EnglishSpellingNormalizer {
  private mapping: {[key: string]: string};

  constructor() {
    const mappingPath = path.join(__dirname, 'english.json');
    this.mapping = JSON.parse(fs.readFileSync(mappingPath, 'utf-8'));
  }

  normalize(s: string): string {
    return s
      .split(' ')
      .map(word => this.mapping[word] || word)
      .join(' ');
  }
}
