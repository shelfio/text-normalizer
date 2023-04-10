import {EnglishNumberNormalizer} from './english-number';

describe('englishNumberNormalizer', () => {
  const normalizer = new EnglishNumberNormalizer();

  it('normalize basic numbers', () => {
    expect(normalizer.normalize('five')).toBe('5');
    expect(normalizer.normalize('thirty')).toBe('30');
    expect(normalizer.normalize('twenty-two')).toBe('22');
    expect(normalizer.normalize('one hundred')).toBe('100');
    expect(normalizer.normalize('one hundred and one')).toBe('101');
    expect(normalizer.normalize('minus one')).toBe('-1');
    expect(normalizer.normalize('double four')).toBe('44');
    expect(normalizer.normalize('triple nine')).toBe('999');
    expect(normalizer.normalize('two point five')).toBe('2.5');
    expect(normalizer.normalize('two and a half')).toBe('2.5');
  });

  it('normalize ordinal numbers', () => {
    expect(normalizer.normalize('first')).toBe('1st');
    expect(normalizer.normalize('third')).toBe('3rd');
    expect(normalizer.normalize('twenty-first')).toBe('21st');
    expect(normalizer.normalize('one hundredth')).toBe('100th');
  });

  it('normalize currency', () => {
    expect(normalizer.normalize('two dollars')).toBe('$2');
    expect(normalizer.normalize('ten euros')).toBe('€10');
    expect(normalizer.normalize('three pounds')).toBe('£3');
    expect(normalizer.normalize('five cents')).toBe('¢5');
    expect(normalizer.normalize('one dollar and five cents')).toBe('$1.05');
  });

  it('normalize large numbers', () => {
    expect(normalizer.normalize('one thousand')).toBe('1000');
    expect(normalizer.normalize('one million')).toBe('1000000');
    expect(normalizer.normalize('three billion')).toBe('3000000000');
    // expect(
    //   normalizer.normalize(
    //     'two hundred and thirty-four million five hundred and sixty-seven thousand eight hundred and ninety'
    //   )
    // ).toBe('234567890');
  });

  it('normalize percentages', () => {
    expect(normalizer.normalize('fifty percent')).toBe('50%');
    expect(normalizer.normalize('twenty five point five percent')).toBe('25.5%');
  });
});
