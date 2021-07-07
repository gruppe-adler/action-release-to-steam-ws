module.exports = {
    root: true,
    env: {
        node: true
    },
    extends: 'standard-with-typescript',
    rules: {
        indent: ['error', 4],
        '@typescript-eslint/indent': ['error', 4],
        semi: 'off',
        '@typescript-eslint/semi': ['error', 'always'],
        'no-extra-semi': 'off',
        'space-before-function-paren': ['error', 'never'],
        '@typescript-eslint/space-before-function-paren': ['error', 'never'],
        '@typescript-eslint/promise-function-async': 'off',
        'no-dupe-class-members': 'off',
        'no-console': 'off',
        'no-debugger': 'off',
        'linebreak-style': 'off',
        'comma-dangle': ['warn', 'never'],
        'arrow-parens': ['warn', 'as-needed'],
        'lines-between-class-members': [
            'warn',
            'always',
            { exceptAfterSingleLine: true }
        ],
        'object-curly-newline': 'off',
        'no-continue': 'off',
        'import/extensions': 'off',
        'import/no-cycle': 'off',
        'func-names': ['warn', 'as-needed'],
        'no-loop-func': 'off'
    },
    parserOptions: {
        project: './tsconfig.json'
    }
};
