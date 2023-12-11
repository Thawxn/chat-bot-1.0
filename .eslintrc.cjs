module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': [
      'error',
      {
        singleQuote: true,
        parser: 'flow',
      },
      {
        fileInfoOptions: {
          withNodeModules: true,
        },
      },
    ],
    'class-methods-use-this': 'off',
    'no-param-reassign': 'off',
    camelcase: 'off',
    'no-underscore-dangle': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    // eslint-disable-next-line no-bitwise
    'import/extensions': ['never' | 'always' | 'ignorePackages'],
  },
};
