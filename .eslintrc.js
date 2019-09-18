const path = require('path')

module.exports = {
  parser: 'babel-eslint',
  extends: 'airbnb',
  parserOptions: {
    ecmaVersion: 6,
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    semi: ['error', 'never'],

    'import/prefer-default-export': 0,
    'import/no-extraneous-dependencies': 0,
    'no-plusplus': ['error', { 'allowForLoopAfterthoughts': true }],

    'jsx-a11y/label-has-associated-control': 0,
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,

    'no-unused-expressions': ['error', { allowShortCircuit: true }],
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,

    'consistent-return': 0,

    'no-script-url': 0,
  },
  globals: {
    document: true,
    FormData: true,
    window: true,
  }
}
