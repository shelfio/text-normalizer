import tsRules from '@shelf/eslint-config/typescript-no-prettier.js';

export default [
  {files: ['**/*.js', '**/*.json', '**/*.ts']},
  ...tsRules,
  {
    ignores: ['**/coverage/', '**/lib/', '**/renovate.json'],
  },
];
