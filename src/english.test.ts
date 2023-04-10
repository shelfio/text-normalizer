import {expect} from '@jest/globals';
import {EnglishTextNormalizer} from './english';
import {EnglishSpellingNormalizer} from './english-spelling';
import {EnglishNumberNormalizer} from './english-number';

it.each([new EnglishNumberNormalizer(), new EnglishTextNormalizer()])('numberNormalizer', std => {
  expect(std.normalize('two')).toBe('2');
  expect(std.normalize('thirty one')).toBe('31');
  expect(std.normalize('five twenty four')).toBe('524');
  expect(std.normalize('nineteen ninety nine')).toBe('1999');
  expect(std.normalize('twenty nineteen')).toBe('2019');

  expect(std.normalize('two point five million')).toBe('2500000');
  expect(std.normalize('four point two billions')).toBe('4200000000s');
  expect(std.normalize('200 thousand')).toBe('200000');
  expect(std.normalize('200 thousand dollars')).toBe('$200000');
  expect(std.normalize('$20 million')).toBe('$20000000');
  expect(std.normalize('€52.4 million')).toBe('€52400000');
  expect(std.normalize('£77 thousands')).toBe('£77000s');

  expect(std.normalize('two double o eight')).toBe('2008');

  expect(std.normalize('three thousand twenty nine')).toBe('3029');
  expect(std.normalize('forty three thousand two hundred sixty')).toBe('43260');
  expect(std.normalize('forty three thousand two hundred and sixty')).toBe('43260');

  expect(std.normalize('nineteen fifties')).toBe('1950s');
  expect(std.normalize('thirty first')).toBe('31st');
  expect(std.normalize('thirty three thousand and three hundred and thirty third')).toBe('33333rd');

  expect(std.normalize('three billion')).toBe('3000000000');
  expect(std.normalize('millions')).toBe('1000000s');

  expect(std.normalize('july third twenty twenty')).toBe('july 3rd 2020');
  expect(std.normalize('august twenty sixth twenty twenty one')).toBe('august 26th 2021');
  expect(std.normalize('3 14')).toBe('3 14');
  expect(std.normalize('3.14')).toBe('3.14');
  expect(std.normalize('3 point 2')).toBe('3.2');
  expect(std.normalize('3 point 14')).toBe('3.14');
  expect(std.normalize('fourteen point 4')).toBe('14.4');
  expect(std.normalize('two point two five dollars')).toBe('$2.25');
  expect(std.normalize('two hundred million dollars')).toBe('$200000000');
  expect(std.normalize('$20.1 million')).toBe('$20100000');
  expect(std.normalize('ninety percent')).toBe('90%');
  expect(std.normalize('seventy six per cent')).toBe('76%');

  expect(std.normalize('double oh seven')).toBe('007');
  expect(std.normalize('double zero seven')).toBe('007');
  expect(std.normalize('nine one one')).toBe('911');
  expect(std.normalize('nine double one')).toBe('911');
  expect(std.normalize('one triple oh one')).toBe('10001');

  expect(std.normalize('two thousandth')).toBe('2000th');
  expect(std.normalize('thirty two thousandth')).toBe('32000th');

  expect(std.normalize('minus 500')).toBe('-500');
  expect(std.normalize('positive twenty thousand')).toBe('+20000');

  expect(std.normalize('two dollars and seventy cents')).toBe('$2.70');
  expect(std.normalize('3 cents')).toBe('¢3');
  expect(std.normalize('$0.36')).toBe('¢36');
  expect(std.normalize('three euros and sixty five cents')).toBe('€3.65');

  expect(std.normalize('three and a half million')).toBe('3500000');
  expect(std.normalize('forty eight and a half dollars')).toBe('$48.5');
  expect(std.normalize('b747')).toBe('b 747');
  expect(std.normalize('10 th')).toBe('10th');
  expect(std.normalize('10th')).toBe('10th');
});

it('spellingNormalizer', () => {
  const std = new EnglishSpellingNormalizer();

  expect(std.normalize('mobilisation')).toBe('mobilization');
  expect(std.normalize('cancelation')).toBe('cancellation');
});

it('textNormalizer', () => {
  const std = new EnglishTextNormalizer();

  expect(std.normalize("Let's")).toBe('let us');
  expect(std.normalize("he's like")).toBe('he is like');
  expect(std.normalize("she's been like")).toBe('she has been like');
  expect(std.normalize('10km')).toBe('10 km');
  expect(std.normalize('10mm')).toBe('10 mm');
  expect(std.normalize('RC232')).toBe('rc 232');

  expect(std.normalize('Mr. Park visited Assoc. Prof. Kim Jr.')).toBe(
    'mister park visited associate professor kim junior'
  );
});
