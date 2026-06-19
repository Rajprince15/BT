// BHAVITA TEXTILES — ESLint flat config (ESLint 9+/10, Next.js 16+).
// Migrated from `.eslintrc.cjs` to satisfy `next lint` deprecation /
// the ESLint CLI used by `eslint-config-next@^16`.
import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals'),

  // Global rule: nobody may import `@/mocks/*` outside of `src/services/**`
  // (services are the only allowed boundary between mocks and the app).
  {
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['@/mocks/*'],
              message:
                'Mocks are internal to the service layer. Import via a service function in src/services/**.',
            },
          ],
        },
      ],
    },
  },

  // App / components / hooks: no direct axios, no direct mocks, no lib/api.
  // They MUST go through services.
  {
    files: [
      'src/app/**/*.{ts,tsx}',
      'src/components/**/*.{ts,tsx}',
      'src/hooks/**/*.{ts,tsx}',
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

  // Ignore generated / build outputs
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'public/**',
      'next-env.d.ts',
      'sentry.*.config.ts',
    ],
  },
];

export default eslintConfig;
