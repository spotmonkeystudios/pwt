module.exports = {
  parser: 'vue-eslint-parser',
  parserOptions: {
    ecmaVersion: 2021,
    parser: '@babel/eslint-parser',
    sourceType: 'module',
  },
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  settings: {},
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:vue/vue3-strongly-recommended',
    'plugin:prettier/recommended',
  ],
  plugins: [
    '@babel',
    'simple-import-sort',
    'sort-destructure-keys',
    'sort-export-all',
  ],
  rules: {
    'no-unused-vars': 'off',

    'simple-import-sort/exports': 'error',
    'simple-import-sort/imports': 'error',

    'sort-destructure-keys/sort-destructure-keys': 'error',
    'sort-export-all/sort-export-all': 'error',
  },
  overrides: [],
}
