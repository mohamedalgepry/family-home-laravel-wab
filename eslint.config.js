import js from '@eslint/js';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default [
    js.configs.recommended,
    {
        files: ['resources/js/**/*.{js,jsx}'],
        languageOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            parserOptions: {
                ecmaFeatures: { jsx: true },
            },
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        plugins: {
            react,
            'react-hooks': reactHooks,
        },
        rules: {
            ...react.configs.recommended.rules,
            ...reactHooks.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/prop-types': 'off',
            'react/no-unknown-property': ['error', { ignore: ['head-key', 'hrefLang', 'hreflang'] }],
            'react/no-children-prop': 'warn',
            'no-empty': ['error', { allowEmptyCatch: true }],
            'react-hooks/rules-of-hooks': 'error',
            'react-hooks/preserve-manual-memoization': 'off',
            'react-hooks/set-state-in-effect': 'off',
            'react-hooks/exhaustive-deps': 'off',
            'react-hooks/purity': 'off',
            'react-hooks/refs': 'off',
            'no-unused-vars': 'off',
            'no-dupe-keys': 'off',
            'no-useless-escape': 'off',
            'no-undef': 'off',
        },
        settings: {
            react: { version: 'detect' },
        },
    },
    {
        ignores: ['node_modules/**', 'public/build/**', 'bootstrap/ssr/**', 'vendor/**'],
    },
];
