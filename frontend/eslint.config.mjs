// BHAVITA TEXTILES — ESLint flat config
// ESLint 9 + Next.js 15
//
// Architecture:
// UI (app/components/hooks) → services → mocks/API
//
// Mocks are intentionally private to the service layer.
// Services are allowed to import mocks.
// App/components/hooks are NOT allowed to import mocks or the API client.

import { FlatCompat } from '@eslint/eslintrc';
import tseslint from '@typescript-eslint/eslint-plugin';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  // Next.js recommended rules
  ...compat.extends('next/core-web-vitals'),

  // TypeScript ESLint plugin
  {
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
    },
  },

  // Application architecture boundary.
  //
  // These files represent the UI/application layer and must use
  // service functions instead of importing mocks or the API client directly.
  {
    files: [
      'src/app/**/*.{js,jsx,ts,tsx}',
      'src/components/**/*.{js,jsx,ts,tsx}',
      'src/hooks/**/*.{js,jsx,ts,tsx}',
    ],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['axios', 'axios/*'],
              message:
                'Do not import axios directly. Use a service in src/services/** which uses src/lib/api.',
            },
            {
              group: ['@/mocks/*'],
              message:
                'Mocks are internal to the service layer. Import via a service function in src/services/**.',
            },
            {
              group: ['@/lib/api', '@/lib/api.ts'],
              message:
                'The Axios client is private to the service layer. Use a service function in src/services/**.',
            },
          ],
        },
      ],
    },
  },

  // Generated / build output
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'next-env.d.ts',
      'sentry.*.config.ts',
      '.netlify/**',
    ],
  },
];

export default eslintConfig;