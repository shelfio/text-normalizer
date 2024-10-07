# text-normalizer [![CircleCI](https://circleci.com/gh/shelfio/text-normalizer/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/text-normalizer/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

_Originally took from [openai/whisperer](https://github.com/openai/whisper/tree/main/whisper/normalizers) and rewrote to TS_

TypeScript library for normalizing English text. It provides a utility class `EnglishTextNormalizer` with methods for normalizing various types of text, such as contractions, abbreviations, and spacing.
`EnglishTextNormalizer` consists of other classes you can reuse independently:

- `EnglishSpellingNormalizer` - uses a dictionary of English words and their American spelling. The dictionary is stored in a JSON file named english.json
  - [examples](https://github.com/shelfio/text-normalizer/blob/master/src/english.test.ts#L71-L76)
- `EnglishNumberNormalizer` - works specifically to normalize text from English words to actually numbers
  - [examples](https://github.com/shelfio/text-normalizer/blob/master/src/english-number.test.ts)
- `BasicTextNormalizer` - provides methods for removing special characters and diacritics from text, as well as splitting words into separate letters.
  - [examples](https://github.com/shelfio/text-normalizer/blob/master/src/basic.test.ts)

## Install

```
$ yarn add @shelf/text-normalizer
```

## Usage

### Node.js

```js
import {EnglishTextNormalizer} from '@shelf/text-normalizer';

const normalizer = new EnglishTextNormalizer();

console.log(normalizer.normalize("Let's")); // Output: let us
console.log(normalizer.normalize("he's like")); // Output: he is like
console.log(normalizer.normalize("she's been like")); // Output: she has been like
console.log(normalizer.normalize('10km')); // Output: 10 km
console.log(normalizer.normalize('10mm')); // Output: 10 mm
console.log(normalizer.normalize('RC232')); // Output: rc 232
console.log(normalizer.normalize('Mr. Park visited Assoc. Prof. Kim Jr.')); // Output: mister park visited associate professor kim junior
```

### Browser

```js
import {EnglishTextNormalizer} from 'https://esm.sh/@shelf/text-normalizer';

const normalizer = new EnglishTextNormalizer();

console.log(normalizer.normalize("Let's")); // Output: let us
console.log(normalizer.normalize("he's like!")); // Output: he is like
```

## Advanced Usage

### Using EnglishNumberNormalizer

```js
import {EnglishNumberNormalizer} from '@shelf/text-normalizer';

const numberNormalizer = new EnglishNumberNormalizer();

console.log(numberNormalizer.normalize('twenty-five')); // Output: 25
console.log(numberNormalizer.normalize('three million')); // Output: 3000000
console.log(numberNormalizer.normalize('two and a half')); // Output: 2.5
console.log(numberNormalizer.normalize('fifty percent')); // Output: 50%
```

### Using EnglishSpellingNormalizer

```js
import {EnglishSpellingNormalizer} from '@shelf/text-normalizer';

const spellingNormalizer = new EnglishSpellingNormalizer();

console.log(spellingNormalizer.normalize('colour')); // Output: color
console.log(spellingNormalizer.normalize('organise')); // Output: organize
```

### Using BasicTextNormalizer

```js
import {BasicTextNormalizer} from '@shelf/text-normalizer';

const basicNormalizer = new BasicTextNormalizer(true, true);

console.log(basicNormalizer.normalize('Café!')); // Output: c a f e
console.log(basicNormalizer.normalize('Hello [World]')); // Output: h e l l o
```

## Configuration

### BasicTextNormalizer

The `BasicTextNormalizer` constructor accepts two optional boolean parameters:

- `removeDiacritics` (default: `false`): If set to `true`, diacritics will be removed from the text.
- `splitLetters` (default: `false`): If set to `true`, letters will be split into individual characters.

Example:

```js
const normalizer = new BasicTextNormalizer(true, true);
```

## Performance Considerations

- The `EnglishTextNormalizer` combines multiple normalization techniques and may be slower for very large texts. Consider using individual normalizers (`EnglishNumberNormalizer`, `EnglishSpellingNormalizer`, or `BasicTextNormalizer`) if you only need specific functionality.
- For repeated normalization of large amounts of text, consider initializing the normalizer once and reusing it to avoid unnecessary setup time.

## Related Projects

- [compromise](https://github.com/spencermountain/compromise) - Natural language processing in JavaScript

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
