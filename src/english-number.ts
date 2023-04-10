import Fraction from 'fraction.js';
import {windowed} from './helpers';

export class EnglishNumberNormalizer {
  zeros: Set<string>;
  ones: Map<string, number>;
  onesPlural: Map<string, [number, string]>;
  onesOrdinal: Map<string, [number, string]>;
  onesSuffixed: Map<string, [number, string]>;
  tens: Map<string, number>;
  tensPlural: Map<string, [number, string]>;
  tensOrdinal: Map<string, [number, string]>;
  tensSuffixed: Map<string, [number, string]>;
  multipliers: Map<string, number>;
  multipliersPlural: Map<string, [number, string]>;
  multipliersOrdinal: Map<string, [number, string]>;
  multipliersSuffixed: Map<string, [number, string]>;
  decimals: Set<string>;
  precedingPrefixers: Map<string, string>;
  followingPrefixers: Map<string, string>;
  prefixes: Set<string>;
  suffixers: Map<string, string | Map<string, string>>;
  specials: Set<string>;
  words: Set<string>;
  literalWords: Set<string>;

  constructor() {
    this.zeros = new Set(['o', 'oh', 'zero']);
    this.ones = new Map(
      [
        'one',
        'two',
        'three',
        'four',
        'five',
        'six',
        'seven',
        'eight',
        'nine',
        'ten',
        'eleven',
        'twelve',
        'thirteen',
        'fourteen',
        'fifteen',
        'sixteen',
        'seventeen',
        'eighteen',
        'nineteen',
      ].map((name, i) => [name, i + 1])
    );
    this.onesPlural = new Map(
      Array.from(this.ones.entries()).map(([name, value]) => {
        const pluralName = name === 'six' ? 'sixes' : `${name}s`;

        return [pluralName, [value, 's']];
      })
    );
    // @ts-ignore
    this.onesOrdinal = new Map([
      ['zeroth', [0, 'th']],
      ['first', [1, 'st']],
      ['second', [2, 'nd']],
      ['third', [3, 'rd']],
      ['fifth', [5, 'th']],
      ['twelfth', [12, 'th']],
      ...Array.from(this.ones.entries())
        .filter(([, value]) => value > 3 && value !== 5 && value !== 12)
        .map(([name, value]) => [name + (name.endsWith('t') ? 'h' : 'th'), [value, 'th']]),
    ]);
    this.onesSuffixed = new Map([
      ...Array.from(this.onesPlural.entries()),
      ...Array.from(this.onesOrdinal.entries()),
    ]);

    this.tens = new Map(
      ['twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'].map(
        (name, i) => [name, (i + 2) * 10]
      )
    );
    this.tensPlural = new Map(
      Array.from(this.tens.entries()).map(([name, value]) => [
        name.replace('y', 'ies'),
        [value, 's'],
      ])
    );
    this.tensOrdinal = new Map(
      Array.from(this.tens.entries()).map(([name, value]) => [
        name.replace('y', 'ieth'),
        [value, 'th'],
      ])
    );
    this.tensSuffixed = new Map([
      ...Array.from(this.tensPlural.entries()),
      ...Array.from(this.tensOrdinal.entries()),
    ]);

    this.multipliers = new Map([
      ['hundred', 100],
      ['thousand', 1_000],
      ['million', 1_000_000],
      ['billion', 1_000_000_000],
      ['trillion', 1_000_000_000_000],
      ['quadrillion', 1_000_000_000_000_000],
      ['quintillion', 1_000_000_000_000_000_000],
      ['sextillion', 1_000_000_000_000_000_000_000],
      ['septillion', 1_000_000_000_000_000_000_000_000],
      ['octillion', 1_000_000_000_000_000_000_000_000_000],
      ['nonillion', 1_000_000_000_000_000_000_000_000_000_000],
      ['decillion', 1_000_000_000_000_000_000_000_000_000_000_000],
    ]);
    this.multipliersPlural = new Map(
      Array.from(this.multipliers.entries()).map(([name, value]) => [`${name}s`, [value, 's']])
    );
    this.multipliersOrdinal = new Map(
      Array.from(this.multipliers.entries()).map(([name, value]) => [`${name}th`, [value, 'th']])
    );
    this.multipliersSuffixed = new Map([
      ...Array.from(this.multipliersPlural.entries()),
      ...Array.from(this.multipliersOrdinal.entries()),
    ]);
    this.decimals = new Set([
      ...Array.from(this.ones.keys()),
      ...Array.from(this.tens.keys()),
      ...Array.from(this.zeros.keys()),
    ]);

    this.precedingPrefixers = new Map([
      ['minus', '-'],
      ['negative', '-'],
      ['plus', '+'],
      ['positive', '+'],
    ]);
    this.followingPrefixers = new Map([
      ['pound', '£'],
      ['pounds', '£'],
      ['euro', '€'],
      ['euros', '€'],
      ['dollar', '$'],
      ['dollars', '$'],
      ['cent', '¢'],
      ['cents', '¢'],
    ]);
    this.prefixes = new Set([
      ...Array.from(this.precedingPrefixers.values()),
      ...Array.from(this.followingPrefixers.values()),
    ]);
    // @ts-ignore
    this.suffixers = new Map([
      ['per', new Map([['cent', '%']])],
      ['percent', '%'],
    ]);
    this.specials = new Set(['and', 'double', 'triple', 'point']);

    this.words = new Set(
      ([] as string[]).concat(
        ...[
          this.zeros,
          this.ones,
          this.onesSuffixed,
          this.tens,
          this.tensSuffixed,
          this.multipliers,
          this.multipliersSuffixed,
          this.precedingPrefixers,
          this.followingPrefixers,
          this.suffixers,
          this.specials,
        ].map(mapping => Array.from(mapping.keys()))
      )
    );
    this.literalWords = new Set(['one', 'ones']);
  }

  // eslint-disable-next-line complexity
  *processWords(words: string[]): IterableIterator<string> {
    let prefix: string | null = null;
    let value: string | number | null = null;
    let skip = false;

    function toFraction(s: string): Fraction | null {
      try {
        return new Fraction(s);
      } catch {
        return null;
      }
    }

    function output(result: string | number): string {
      if (prefix !== null) {
        result = prefix + result;
      }
      value = null;
      prefix = null;

      return String(result);
    }

    if (words.length === 0) {
      return;
    }

    for (const [prev, current, next] of windowed<string>(['', ...words, ''], 3)) {
      if (skip) {
        skip = false;
        continue;
      }

      const nextIsNumeric = next !== null && /^\d+(\.\d+)?$/.test(next);
      const hasPrefix = this.prefixes.has(current[0]);
      // @ts-ignore
      const currentWithoutPrefix = hasPrefix ? current.slice(1) : current;

      if (/^\d+(\.\d+)?$/.test(currentWithoutPrefix)) {
        const f = toFraction(currentWithoutPrefix);

        if (value !== null) {
          if (typeof value === 'string' && value.endsWith('.')) {
            value = String(value) + String(current);
            continue;
          } else {
            yield output(value);
          }
        }

        if (current != null) {
          prefix = hasPrefix ? current[0] : prefix;
        }

        if (f !== null && f.d === 1) {
          value = f.n;
        } else {
          value = currentWithoutPrefix;
        }
      } else if (!this.words.has(current)) {
        if (value !== null) {
          yield output(value);
        }
        yield output(current);
      } else if (this.zeros.has(current)) {
        value = `${String(value || '')}0`;
      } else if (this.ones.has(current)) {
        const ones = this.ones.get(current);

        if (value === null) {
          // @ts-ignore
          value = ones;
        } else if (typeof value === 'string' || this.ones.has(prev)) {
          if (this.tens.has(prev) && ones! < 10) {
            value = (value as string).slice(0, -1) + String(ones);
          } else {
            value = String(value) + String(ones);
          }
        } else if (ones! < 10) {
          if (value % 10 === 0) {
            value += ones!;
          } else {
            value = String(value) + String(ones);
          }
        } else {
          if (value % 100 === 0) {
            value += ones!;
          } else {
            value = String(value) + String(ones);
          }
        }
      } else if (this.onesSuffixed.has(current)) {
        const [ones, suffix] = this.onesSuffixed.get(current)!;

        if (value === null) {
          yield output(String(ones) + suffix);
        } else if (typeof value === 'string' || this.ones.has(prev)) {
          if (this.tens.has(prev) && ones < 10) {
            value = String(value).slice(0, -1) + String(ones) + suffix;
          } else {
            value = String(value) + String(ones) + suffix;
          }
        } else if (ones < 10) {
          if (value % 10 === 0) {
            yield output(String(value + ones) + suffix);
          } else {
            yield output(String(value) + String(ones) + suffix);
          }
        } else {
          if (value % 100 === 0) {
            yield output(String(value + ones) + suffix);
          } else {
            yield output(String(value) + String(ones) + suffix);
          }
        }
        value = null;
      } else if (this.tens.has(current)) {
        const tens = this.tens.get(current);

        if (value === null) {
          // @ts-ignore
          value = tens;
        } else if (typeof value === 'string') {
          value = String(value) + String(tens);
        } else {
          if (value % 100 === 0) {
            value += tens!;
          } else {
            value = String(value) + String(tens);
          }
        }
      } else if (this.tensSuffixed.has(current)) {
        const [tens, suffix] = this.tensSuffixed.get(current)!;

        if (value === null) {
          yield output(String(tens) + suffix);
        } else if (typeof value === 'string') {
          yield output(String(value) + String(tens) + suffix);
        } else {
          if (value % 100 === 0) {
            yield output(String(value + tens) + suffix);
          } else {
            yield output(String(value) + String(tens) + suffix);
          }
        }
      } else if (this.multipliers.has(current)) {
        const multiplier = this.multipliers.get(current);

        if (value === null) {
          // @ts-ignore
          value = multiplier;
        } else if (typeof value === 'string' || value === 0) {
          const f = toFraction(value as string);
          const p = f !== null ? f.mul(multiplier!) : null;

          if (f !== null && p?.d === 1) {
            value = p.n;
          } else {
            yield output(value);
            // @ts-ignore
            value = multiplier;
          }
        } else {
          const before: number = Math.floor(value / 1000) * 1000;
          const residual: number = value % 1000;
          value = before + residual * multiplier!;
        }
      } else if (this.multipliersSuffixed.has(current)) {
        const [multiplier, suffix] = this.multipliersSuffixed.get(current)!;

        if (value === null) {
          yield output(String(multiplier) + suffix);
        } else if (typeof value === 'string') {
          const f = toFraction(value);
          const p = f !== null ? f.mul(multiplier) : null;

          if (f !== null && p?.d === 1) {
            yield output(String(p.n) + suffix);
          } else {
            yield output(value);
            yield output(String(multiplier) + suffix);
          }
        } else {
          const before = Math.floor(value / 1000) * 1000;
          const residual = value % 1000;
          value = before + residual * multiplier;
          yield output(String(value) + suffix);
        }
        value = null;
      } else if (this.precedingPrefixers.has(current)) {
        if (value !== null) {
          yield output(value);
        }

        if (this.words.has(next) || nextIsNumeric) {
          prefix = this.precedingPrefixers.get(current) || null;
        } else {
          yield output(current);
        }
      } else if (this.followingPrefixers.has(current)) {
        if (value !== null) {
          prefix = this.followingPrefixers.get(current) || null;
          yield output(value);
        } else {
          yield output(current);
        }
      } else if (this.suffixers.has(current)) {
        if (value !== null) {
          const suffix = this.suffixers.get(current);

          if (typeof suffix === 'string') {
            yield output(String(value) + suffix);
          } else {
            const mappedSuffix = suffix?.get(next!);

            if (mappedSuffix !== undefined) {
              yield output(String(value) + mappedSuffix);
              skip = true;
            } else {
              yield output(value);
              yield output(current);
            }
          }
        } else {
          yield output(current);
        }
      } else if (this.specials.has(current)) {
        if (!this.words.has(next) && !nextIsNumeric) {
          if (value !== null) {
            yield output(value);
          }
          yield output(current);
        } else if (current === 'and') {
          if (!this.multipliers.has(prev)) {
            if (value !== null) {
              yield output(value);
            }
            yield output(current);
          }
        } else if (current === 'double' || current === 'triple') {
          if (this.ones.has(next) || this.zeros.has(next)) {
            const repeats = current === 'double' ? 2 : 3;
            const ones = this.ones.get(next) || 0;
            value = String(value || '') + String(ones).repeat(repeats);
            skip = true;
          } else {
            if (value !== null) {
              yield output(value);
            }
            yield output(current);
          }
        } else if (current === 'point') {
          if (this.decimals.has(next) || nextIsNumeric) {
            value = `${String(value || '')}.`;
          }
        } else {
          throw new Error(`Unexpected token: ${current}`);
        }
      } else {
        throw new Error(`Unexpected token: ${current}`);
      }
    }

    if (value !== null) {
      yield output(value);
    }
  }

  // eslint-disable-next-line complexity
  preprocess(s: string): string {
    const results: string[] = [];

    const segments = s.split(new RegExp('\\band\\s+a\\s+half\\b'));
    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];

      if (!segment) {
        continue;
      }

      if (i === segments.length - 1) {
        results.push(segment);
      } else {
        results.push(segment);
        const lastWord = segment.trim().split(/\s+/).pop()!;

        if (this.decimals.has(lastWord) || this.multipliers.has(lastWord)) {
          results.push('point five');
        } else {
          results.push('and a half');
        }
      }
    }
    s = results.join(' ');

    s = s.replace(/([a-z])([0-9])/g, '$1 $2');
    s = s.replace(/([0-9])([a-z])/g, '$1 $2');

    s = this.handleHyphenatedNumbers(s);

    s = s.replace(/([0-9])\s+(st|nd|rd|th|s)\b/g, '$1$2');

    return s;
  }

  handleHyphenatedNumbers(s: string): string {
    const hyphenatedNumberPattern =
      /\b(twenty|thirty|forty|fifty|sixty|seventy|eighty|ninety)[-](first|second|third|fourth|fifth|sixth|seventh|eighth|ninth|one|two|three|four|five|six|seven|eight|nine)\b/g;

    return s.replace(hyphenatedNumberPattern, (match, p1, p2) => {
      const tensValue = this.tens.get(p1);
      const isOrdinal = this.onesOrdinal.has(p2);
      const onesValue = isOrdinal ? this.onesOrdinal.get(p2)?.[0] : this.ones.get(p2);

      if (tensValue && onesValue) {
        const combinedNumber = tensValue + onesValue;
        const suffix = isOrdinal ? this.onesOrdinal.get(p2)?.[1] || '' : '';

        return `${combinedNumber}${suffix}`;
      }

      return match;
    });
  }

  postprocess(s: string): string {
    const combineCents = (m: RegExpMatchArray): string => {
      try {
        const currency = m[1];
        const integer = m[2] === 'one' ? '1' : m[2];
        const cents = parseInt(m[3], 10);

        return `${currency}${integer}.${cents.toString().padStart(2, '0')}`;
      } catch (error) {
        return String(m.input);
      }
    };

    const extractCents = (m: RegExpMatchArray): string => {
      try {
        return `¢${parseInt(m[1], 10)}`;
      } catch (error) {
        return String(m.input);
      }
    };

    let match: RegExpMatchArray | null;

    // Apply currency postprocessing; "$2 and ¢7" -> "$2.07"
    const combineCentsPattern = /([€£$])([0-9]+|one) (?:and )?¢([0-9]{1,2})\b/g;
    while ((match = combineCentsPattern.exec(s)) !== null) {
      s = s.replace(match[0], combineCents(match));
    }

    const extractCentsPattern = /[€£$]0.([0-9]{1,2})\b/g;
    while ((match = extractCentsPattern.exec(s)) !== null) {
      s = s.replace(match[0], extractCents(match));
    }

    // Write "one(s)" instead of "1(s)", just for readability
    // s = s.replace(/\b1(s?)\b/g, 'one$1');

    return s;
  }

  normalize(s: string): string {
    s = this.preprocess(s);
    s = Array.from(this.processWords(s.split(' ').filter(s => s.length)))
      .filter(word => word !== null)
      .join(' ');
    s = this.postprocess(s);

    return s;
  }
}
