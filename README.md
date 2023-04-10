# text-normalizer [![CircleCI](https://circleci.com/gh/shelfio/text-normalizer/tree/master.svg?style=svg)](https://circleci.com/gh/shelfio/xxxxxx/tree/master)![](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)

> text-normalizer description

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
