module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'import'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:prettier/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    'import/order': [
      'error',
      {
        pathGroups: [
          {
            pattern: '@root/**',
            group: 'parent',
            position: 'before',
          },
          {
            pattern: '@database/**',
            group: 'parent',
          },
          {
            pattern: '@libraries/**',
            group: 'parent',
          },
          {
            pattern: '@services/**',
            group: 'parent',
          },
          {
            pattern: '@helpers/**',
            group: 'parent',
          },
          {
            pattern: '@guards/**',
            group: 'parent',
          },
          {
            pattern: '@pipes/**',
            group: 'parent',
          },
          {
            pattern: '@errors/**',
            group: 'parent',
          },
          {
            pattern: '@interfaces/**',
            group: 'parent',
            position: 'after',
          },
          {
            pattern: './*.interface',
            group: 'type',
            position: 'after',
          },
          {
            pattern: './**',
            patternOptions: { matchBase: true },
            group: 'index',
          },
        ],
        pathGroupsExcludedImportTypes: ['builtin', 'parent', 'type'],
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'object',
          'type',
          'index',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc' },
      },
    ],
    'import/no-unresolved': 'off',
    'import/prefer-default-export': 'off',
    'import/named': 'error',
    'import/default': 'error',
    'import/namespace': 'error',
    'import/newline-after-import': ['error', { count: 1 }],
    'import/extensions': 'off',
    'import/no-cycle': 'error',
    'import/export': 'error',
    'import/no-duplicates': 'error',

    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: ['interface', 'typeAlias'],
        format: ['PascalCase'],
        custom: {
          regex: '^I[A-Z]',
          match: true,
        },
      },
    ],
    '@typescript-eslint/array-type': ['error', { default: 'array' }],
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: false,
      },
    ],
    '@typescript-eslint/consistent-type-imports': ['error'],
    'no-plusplus': 'error',
    'no-implicit-coercion': 'error',
    'no-unneeded-ternary': 'error',
    quotes: ['error', 'single', { avoidEscape: true }],
    eqeqeq: 'error',
    'sort-imports': ['error', { ignoreDeclarationSort: true }],
    curly: 'error',
    'no-console': ['error', { allow: ['info', 'error'] }],
    'no-empty': ['error', { allowEmptyCatch: true }],
  },
};
