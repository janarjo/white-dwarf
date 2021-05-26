module.exports = {
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: ['plugin:@typescript-eslint/recommended'],
    parserOptions: {
        ecmaVersion: 2018,
        project: ['./tsconfig.json'],
        sourceType: 'module',
    },
    rules: {
        'eqeqeq': 1,
        'semi': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        'indent': [2, 4, { 'FunctionExpression': { 'body': 1, 'parameters': 2 }, 'SwitchCase': 1}],
        '@typescript-eslint/semi': ['error', 'never'],
        '@typescript-eslint/quotes': ['error', 'single', { 'avoidEscape': true }],
        '@typescript-eslint/explicit-module-boundary-types':  'off',
        '@typescript-eslint/member-delimiter-style': ['error',
            {
                'multiline': {
                    'delimiter': 'none',
                    'requireLast': false
                },
                'singleline': {
                    'delimiter': 'comma',
                    'requireLast': false
                },
            }]
    },
    ignorePatterns: ['node_modules/', '.eslintrc.js'],
    overrides: [
        {
            files: ['*.ts']
        }
    ]
}
