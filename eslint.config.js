const globals = require('globals');
const reactPlugin = require('eslint-plugin-react');
const reactHooksPlugin = require('eslint-plugin-react-hooks');

module.exports = [
  {
    ignores: ['build/**', 'coverage/**', 'node_modules/**', '**/sagaMonitor.js'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      // Default parser (espree): JSX + class fields need no Babel.
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
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
      'react-hooks': reactHooksPlugin,
    },
    settings: {
      react: { version: 'detect' },
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
      'no-unused-vars': ['warn', { ignoreRestSiblings: true }],
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
      // Mark JSX identifiers as used (otherwise every imported component is reported by no-unused-vars).
      'react/jsx-uses-vars': 'warn',
      'react/jsx-uses-react': 'warn',
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
