import js from '@eslint/js';
import globals from 'globals';
import { importX } from 'eslint-plugin-import-x';
import { defineConfig, globalIgnores } from 'eslint/config';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

const workspacePackageDirs = [
    '.',
    './src/console',
    './src/mixers',
    './src/mixers-react',
    './src/virtual-devices',
];

export default defineConfig([
    globalIgnores(['dist', 'out', '.webpack']),
    {
        files: ['src/**/*.js', 'src/**/*.jsx'],
        extends: [
            js.configs.recommended,
        ],
        languageOptions: {
            ecmaVersion: 2020,
            globals: {
                ...globals.browser,
                ...globals.node,
                $: 'readonly',
                alert: 'readonly',
                MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: 'readonly',
                MAIN_WINDOW_WEBPACK_ENTRY: 'readonly',
                process: 'readonly',
                __dirname: 'readonly',
            },
            parserOptions: {
                ecmaVersion: 'latest',
                sourceType: 'module',
                ecmaFeatures: { jsx: true },
            },
        },
        plugins: {
            'import-x': importX,
            react: eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
        },
        rules: {
            'arrow-body-style': ['error', 'as-needed'],
            'arrow-parens': ['error', 'as-needed',
                {
                    requireForBlockBody: true,
                },
            ],
            'comma-dangle': ['error',
                {
                    arrays: 'always-multiline',
                    objects: 'always-multiline',
                    imports: 'always-multiline',
                    exports: 'always-multiline',
                    functions: 'never',
                },
            ],
            'consistent-return': ['error'],
            'func-names': ['error', 'as-needed'],
            'function-paren-newline': ['error',
                {
                    minItems: 5,
                },
            ],
            'func-style': ['warn', 'declaration',
                {
                    allowArrowFunctions: true,
                },
            ],
            indent: ['error', 4],
            'import-x/no-unresolved': ['error', {
                ignore: ['^@magical-mixing/'],
            }],
            'import-x/named': 'error',
            'linebreak-style': ['error', 'unix'],
            'no-console': 'off',
            'no-nested-ternary': ['warn'],
            'no-param-reassign': ['error',
                {
                    props: false,
                },
            ],
            'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
            'no-multi-spaces': ['error'],
            'no-restricted-properties': ['warn'],
            'no-underscore-dangle': ['off'],
            'no-undef': ['warn'],
            'no-use-before-define': ['error', { functions: true, classes: true, variables: true }],
            'no-unused-vars': ['error', {
                vars: 'all',
                args: 'after-used',
                ignoreRestSiblings: true,
                caughtErrors: 'none',
            }],
            'no-await-in-loop': ['error'],
            'object-shorthand': ['off', 'methods'],
            'prefer-regex-literals': ['off'],
            'quote-props': ['error', 'as-needed',
                {
                    keywords: false,
                    unnecessary: true,
                    numbers: true,
                },
            ],
            quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
            'no-trailing-spaces': ['error'],
            semi: ['error', 'always'],
            'space-in-parens': ['error', 'never'],
            'import-x/exports-last': ['error'],
            'import-x/newline-after-import': ['error',
                {
                    count: 2,
                },
            ],
            'import-x/no-extraneous-dependencies': ['error',
                {
                    packageDir: workspacePackageDirs,
                },
            ],
            'import-x/no-named-as-default': ['warn'],
            'import-x/order': ['error',
                {
                    'newlines-between': 'never',
                    groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
                },
            ],
            'import-x/prefer-default-export': ['off'],
            'import-x/extensions': ['off'],
            'react/jsx-uses-vars': 'error',
            'react/jsx-no-undef': 'error',
            'react/jsx-props-no-spreading': 'off',
            'react/prop-types': 'off',
            'react/react-in-jsx-scope': 'off',
            'react/function-component-definition': ['error',
                {
                    namedComponents: 'arrow-function',
                    unnamedComponents: 'arrow-function',
                },
            ],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/exhaustive-deps': 'warn',
        },
        settings: {
            'import-x/resolver': {
                node: {
                    extensions: ['.js', '.jsx', '.mjs'],
                },
            },
            react: { version: '19' },
        },
    },
]);
