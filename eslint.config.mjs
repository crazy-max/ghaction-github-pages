import {defineConfig} from 'eslint/config';
import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import globals from 'globals';
import eslintConfigPrettier from 'eslint-config-prettier/flat';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  {
    ignores: ['.yarn/**/*', 'dist/**/*']
  },
  js.configs.recommended,
  ...tseslint.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node
      }
    }
  },
  {
    plugins: {
      prettier: eslintPluginPrettier
    },
    rules: {
      'prettier/prettier': 'error',
      '@typescript-eslint/no-require-imports': [
        'error',
        {
          allowAsImport: true
        }
      ]
    }
  }
]);
