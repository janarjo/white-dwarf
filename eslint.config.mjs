import { defineConfig, globalIgnores } from 'eslint/config';
import typescriptEslintEslintPlugin from '@typescript-eslint/eslint-plugin';
import stylisticTs from '@stylistic/eslint-plugin-ts'
import tsParser from '@typescript-eslint/parser';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default defineConfig(
    {
        ignores: ['**/node_modules/*', '**/build/*']
    },
    {
        rules: {
            eqeqeq: 1,
            semi: 'off',
            quotes: ['error', 'single', { avoidEscape: true }],
            indent: [2, 4, {
                FunctionExpression: {
                    body: 1,
                    parameters: 2,
                },
                SwitchCase: 1,
            }],
            'no-trailing-spaces': 'error',
            'block-spacing': ['error', 'always'],
            'object-curly-spacing': ['error', 'always'],
        }
    },
    {
        files: ['**/*.ts'],
        extends: compat.extends('plugin:@typescript-eslint/recommended'),
        plugins: {
            '@typescript-eslint': typescriptEslintEslintPlugin,
            '@stylistic/ts': stylisticTs
        },
        languageOptions: {
            parser: tsParser,
            ecmaVersion: 2018,
            sourceType: 'module',

            parserOptions: {
                project: ['./tsconfig.json'],
            },
        },
        rules: {
            '@typescript-eslint/explicit-function-return-type': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@stylistic/ts/member-delimiter-style': ['error', {
                multiline: {
                    delimiter: 'none',
                    requireLast: false,
                },

                singleline: {
                    delimiter: 'comma',
                    requireLast: false,
                },
            }],
        },
    });
