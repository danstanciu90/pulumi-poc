module.exports = {
  extends: ['@lego/eslint-config-typescript', '@lego/eslint-config-prettier'],
  parserOptions: {
    ecmaVersion: 2018,
    project: ['tsconfig.json'],
    sourceType: 'module',
    tsconfigRootDir: __dirname,
  },
  rules: {
    '@typescript-eslint/no-implicit-any-catch': 'off',
  },
};
