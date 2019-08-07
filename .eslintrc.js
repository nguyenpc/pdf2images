module.exports = {
    parser: '@typescript-eslint/parser',
    extends: [
        'airbnb-typescript/base',
    ],
    parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
    },
    rules:  {
        'no-dupe-class-members': 'off',
        'import/prefer-default-export': 'off',
    }
};
