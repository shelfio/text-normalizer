import {BasicTextNormalizer} from './basic';

describe('basicTextNormalizer normalize', () => {
  it('returns empty string for empty input', () => {
    const normalizer = new BasicTextNormalizer();

    expect(normalizer.normalize('')).toEqual('');
  });

  it('converts all letters to lowercase', () => {
    const normalizer = new BasicTextNormalizer();

    expect(normalizer.normalize('AbCdEf')).toEqual('abcdef');
  });

  it('removes words between brackets', () => {
    const normalizer = new BasicTextNormalizer();

    expect(normalizer.normalize('This [word] should be removed.')).toEqual(
      'this should be removed'
    );
  });

  it('removes words between parenthesis', () => {
    const normalizer = new BasicTextNormalizer();

    expect(normalizer.normalize('This (word) should be removed.')).toEqual(
      'this should be removed'
    );
  });

  it('removes symbols and diacritics if option is provided', () => {
    const normalizer = new BasicTextNormalizer(true);

    expect(normalizer.normalize('Résûmé')).toEqual('resume');
  });

  it('removes symbols but keeps diacritics if option is not provided', () => {
    const normalizer = new BasicTextNormalizer();

    expect(normalizer.normalize('Café!')).toEqual('café');
  });

  it('splits letters into individual words if option is provided', () => {
    const normalizer = new BasicTextNormalizer(false, true);

    expect(normalizer.normalize('abc')).toEqual('a b c');
  });

  it('replaces successive whitespace characters with a single space', () => {
    const normalizer = new BasicTextNormalizer();

    expect(normalizer.normalize('This    text\nhas, lots of  spaces.')).toEqual(
      'this text has lots of spaces'
    );
  });
});
