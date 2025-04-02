import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import node from 'eslint-plugin-node';

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.node, // Use Node.js globals
    },
    plugins: {
      node,
    },
    rules: {
      'node/no-missing-import': 'off', // TypeScript handles imports
      'node/no-unsupported-features/es-syntax': 'off', // Allow ES modules
      '@typescript-eslint/no-floating-promises': 'error', // Ensure promises are handled
    },
  }
);
