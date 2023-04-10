# text-normalizer [![CircleCI](https://circleci.com/gh/shelfio/text-normalizer/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/text-normalizer/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)
_Originally took from [openai/whisperer](https://github.com/openai/whisper/tree/main/whisper/normalizers) and rewrote to TS_

TypeScript library for normalizing English text. It provides a utility class `EnglishTextNormalizer` with methods for normalizing various types of text, such as contractions, abbreviations, and spacing.
`EnglishTextNormalizer` consists of other classes you can reuse independently:
- `EnglishSpellingNormalizer` -  uses a dictionary of English words and their American spelling. The dictionary is stored in a JSON file named english.json
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

```js
import {EnglishTextNormalizer} from '@shelf/text-normalizer'

const normalizer = new EnglishTextNormalizer()

console.log(normalizer.normalize("Let's")); // Output: let us
console.log(normalizer.normalize("he's like")); // Output: he is like
console.log(normalizer.normalize("she's been like")); // Output: she has been like
console.log(normalizer.normalize('10km')); // Output: 10 km
console.log(normalizer.normalize('10mm')); // Output: 10 mm
console.log(normalizer.normalize('RC232')); // Output: rc 232
console.log(
  normalizer.normalize('Mr. Park visited Assoc. Prof. Kim Jr.')
); // Output: mister park visited associate professor kim junior

```

## Publish

```sh
$ git checkout master
$ yarn version
$ yarn publish
$ git push origin master --tags
```

## License

MIT © [Shelf](https://shelf.io)
