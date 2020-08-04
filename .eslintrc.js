module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
    'prettier/@typescript-eslint',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    "class-methods-use-this": ["off"],
    "function-paren-newline": "off",
    "comma-dangle": [2, "always-multiline"],
    "object-curly-newline": "off",
    "object-shorthand": ["error", "properties"],
    "no-plusplus": "off",
    "no-tabs": "error",
    "quotes": [2, "single", { "avoidEscape": true }],
    "func-names": ["warn", "as-needed"],
    "prefer-destructuring": "off",
    "curly": ["error", "all"],
    "padding-line-between-statements": [
      "error",
      { "blankLine": "always", "prev": ["block-like"], "next": "return" }
    ]
  },
};
