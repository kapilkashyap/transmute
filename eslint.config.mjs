import typescriptEslint from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import globals from 'globals';
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

export default [
    {
        files: ['**/*.ts'],
        ignores: ['dist/']
    },
    ...compat.extends('eslint:recommended', 'plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'),
    {
        plugins: {
            '@typescript-eslint': typescriptEslint,
            prettier
        },

        languageOptions: {
            globals: {
                ...globals.browser,
                ...globals.node
            },

            parser: tsParser
        },

        rules: {
            'no-console': 'off',
            '@typescript-eslint/no-require-imports': 'error',

            'prettier/prettier': [
                'warn',
                {
                    endOfLine: 'auto',
                    singleQuote: true,
                    printWidth: 140,
                    'editor.formatOnSave': true,
                    proseWrap: 'always',
                    tabWidth: 4,
                    requireConfig: false,
                    useTabs: false,
                    trailingComma: 'none',
                    bracketSpacing: true,
                    bracketSameLine: true,
                    semi: true
                }
            ]
        }
    }
];
