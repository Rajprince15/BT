import type { Config } from 'tailwindcss';

/**
 * BHAVITA TEXTILES — Tailwind config.
 *
 * NOTE: This project uses Tailwind CSS v4 where design tokens are primarily
 * configured via the `@theme` CSS directive in `src/app/globals.css`.
 * This file mirrors those tokens so editors / tooling that still read the
 * config file continue to see brand colors and font families correctly.
 * The CSS `@theme` block is the source of truth.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        // Brand tokens (mirror of src/styles/tokens.css)
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        gold: {
          DEFAULT: 'var(--gold)',
          2: 'var(--gold-2)',
          soft: 'var(--gold-soft)',
        },
        navy: 'var(--navy)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Manrope', 'DM Sans', 'system-ui', 'sans-serif'],
        heading: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-sans)', 'Manrope', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.08em',
      },
      boxShadow: {
        luxe: '0 10px 30px -10px rgba(184, 137, 58, 0.25)',
        ink: '0 8px 24px -8px rgba(27, 31, 42, 0.18)',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      transitionTimingFunction: {
        luxe: 'cubic-bezier(0.22, 1, 0.36, 1)',
      },
    },
  },
  plugins: [],
};

export default config;
