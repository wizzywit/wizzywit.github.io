import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import astro from 'eslint-plugin-astro';
import globals from 'globals';
import { archImports } from './tools/eslint-rule-arch.js';

const arch = { rules: { imports: archImports } };

export default tseslint.config(
  { ignores: ['dist', '.astro', '.steiger', 'node_modules', 'docs', '.superpowers', 'playwright-report', 'test-results'] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  ...astro.configs.recommended,
  { files: ['tools/**', '*.config.*'], languageOptions: { globals: globals.node } },
  {
    files: ['**/*.{ts,tsx,astro}'],
    rules: {
      'no-undef': 'off',
      '@typescript-eslint/no-unused-vars': ['error', { varsIgnorePattern: '^_', argsIgnorePattern: '^_', ignoreRestSiblings: true }],
    },
  },
  {
    files: ['src/**/*.{ts,tsx,astro}'],
    plugins: { arch },
    rules: { 'arch/imports': 'error' },
  },
  {
    files: ['src/**/*.{ts,tsx,astro}'],
    ignores: ['src/**/adapter/**', 'src/shared/api/**', 'src/**/*.test.{ts,tsx}'],
    rules: {
      'no-restricted-globals': [
        'error',
        ...['fetch', 'localStorage', 'sessionStorage', 'indexedDB', 'XMLHttpRequest', 'WebSocket'].map((name) => ({
          name,
          message: 'Only adapters (or shared/api) may talk to the outside world.',
        })),
      ],
    },
  },
);
