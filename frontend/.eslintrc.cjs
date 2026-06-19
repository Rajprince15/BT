module.exports = {
  root: true,
  extends: ['next/core-web-vitals', 'eslint:recommended'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        patterns: ['axios', '@/mocks/*'],
      },
    ],
  },
  overrides: [
    {
      files: ['src/app/**/*', 'src/components/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: ['axios', '@/mocks/*', '@/lib/api'],
          },
        ],
      },
    },
    {
      files: ['src/hooks/**/*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            patterns: ['axios', '@/mocks/*', '@/lib/api'],
          },
        ],
      },
    },
  ],
};
