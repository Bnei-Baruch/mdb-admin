const babelParser = require('@babel/eslint-parser');
const globals = require('globals');
const reactPlugin = require('eslint-plugin-react');
const importPlugin = require('eslint-plugin-import');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: ['build/**', 'coverage/**', 'node_modules/**'],
  },
  {
    files: ['**/*.js'],
    languageOptions: {
      parser: babelParser,
      ecmaVersion: 2021,
      sourceType: 'module',
      parserOptions: {
        requireConfigFile: false,
        babelOptions: {
          presets: ['@babel/preset-react'],
        },
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        socket: true,
      },
    },
    plugins: {
      react: reactPlugin,
      import: importPlugin,
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      'import/parser': '@babel/eslint-parser',
      'import/resolve': {},
    },
    rules: {
      'arrow-body-style': 'warn',
      'array-bracket-spacing': 'warn',
      'arrow-parens': ['warn', 'as-needed'],
      'arrow-spacing': 'warn',
      'brace-style': 'warn',
      'comma-spacing': 'warn',
      'consistent-return': 'error',
      'eol-last': 'warn',
      eqeqeq: 'warn',
      indent: ['warn', 2, { ignoredNodes: ['TemplateLiteral'], SwitchCase: 1 }],
      'keyword-spacing': 'warn',
      'linebreak-style': ['error', 'unix'],
      'lines-between-class-members': ['warn', 'always', { exceptAfterSingleLine: true }],
      'no-await-in-loop': 'warn',
      'no-cond-assign': 'error',
      'no-constant-condition': 'warn',
      'no-else-return': 'warn',
      'no-empty': 'warn',
      'no-extra-parens': ['warn', 'functions'],
      'no-lonely-if': 'warn',
      'no-mixed-operators': 'warn',
      'no-multiple-empty-lines': ['warn', { max: 2, maxEOF: 1 }],
      'no-trailing-spaces': 'warn',
      'no-unneeded-ternary': ['warn', { defaultAssignment: false }],
      'no-unreachable': 'warn',
      'no-unused-vars': 'warn',
      'no-useless-concat': 'warn',
      'object-shorthand': 'warn',
      'object-curly-spacing': ['warn', 'always'],
      'padding-line-between-statements': [
        'warn',
        { blankLine: 'always', prev: 'multiline-block-like', next: '*' },
      ],
      'prefer-arrow-callback': 'warn',
      'prefer-const': 'warn',
      'prefer-destructuring': ['warn', { object: true, array: false }],
      'prefer-object-spread': 'warn',
      'prefer-template': 'warn',
      quotes: ['warn', 'single', { allowTemplateLiterals: true }],
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      'rest-spread-spacing': 'warn',
      'semi-style': 'warn',
      'space-before-blocks': 'warn',
      'space-in-parens': 'warn',
      'template-curly-spacing': 'off',
    },
  },
];
