// ESLint 9+ uses "flat config" — a plain JS array instead of JSON/.eslintrc
import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import reactPlugin from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import prettierConfig from 'eslint-config-prettier';

export default [
  // 1. ESLint's own recommended JS rules (no-unused-vars, no-undef, etc.)
  js.configs.recommended,

  // 2. TypeScript files — apply TS parser and rules
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        // Allows ESLint to understand type information for more powerful rules
        project: './tsconfig.app.json',
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
      },
      globals: {
        document: true,
        window: true,
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      // Spread in all TS recommended rules
      ...tsPlugin.configs.recommended.rules,

      // CRITICAL: These two rules prevent the most common React bugs.
      // rules-of-hooks: Hooks must only be called at the top level of
      //   a function component or custom hook — not inside loops, conditions,
      //   or nested functions.
      'react-hooks/rules-of-hooks': 'error',

      // exhaustive-deps: All variables used inside useEffect/useCallback/
      //   useMemo must be listed in the dependency array. Missing deps cause
      //   stale closure bugs that are extremely hard to debug.
      'react-hooks/exhaustive-deps': 'warn',

      // Warns when you export a component in a way that breaks HMR in Vite
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],

      // Disallow 'any' — use 'unknown' and narrow the type instead
      '@typescript-eslint/no-explicit-any': 'warn',

      // Unused variables are almost always bugs or dead code
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
    settings: {
      react: {
        // Tells eslint-plugin-react which React version you're using
        version: 'detect',
      },
    },
  },

  // 3. MUST be last — turns off all ESLint formatting rules that Prettier owns.
  //    Without this, ESLint and Prettier will fight over formatting.
  prettierConfig,
];
