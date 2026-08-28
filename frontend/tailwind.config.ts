import type { Config } from 'tailwindcss';

/**
 * BHAVITA TEXTILES — Editorial Tailwind config.
 * Tokens declared here mirror the CSS `@theme` block in globals.css so tooling
 * can autocomplete brand colors. The CSS `@theme` block is the source of truth.
 */
const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        bg: 'var(--bg)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        paper: 'var(--paper)',
        ink: 'var(--ink)',
        'ink-2': 'var(--ink-2)',
        'ink-3': 'var(--ink-3)',
        gold: {
          DEFAULT: 'var(--gold)',
          2: 'var(--gold-2)',
          soft: 'var(--gold-soft)',
        },
        navy: 'var(--navy)',
        terracotta: 'var(--terracotta)',
        olive: 'var(--olive)',
        ochre: 'var(--ochre)',
        'slate-indigo': 'var(--slate-indigo)',
        success: 'var(--success)',
        danger: 'var(--danger)',
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'Plus Jakarta Sans', 'Manrope', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'JetBrains Mono', 'ui-monospace', 'monospace'],
        heading: ['var(--font-serif)', 'Cormorant Garamond', 'serif'],
        body: ['var(--font-sans)', 'Plus Jakarta Sans', 'sans-serif'],
      },
      letterSpacing: {
        tightest: '-0.04em',
        wider2: '0.08em',
        home: '0.28em',
      },
      boxShadow: {
        paper: '0 20px 60px -40px rgba(28, 27, 24, 0.35)',
        luxe: '0 10px 30px -10px rgba(168, 88, 59, 0.18)',
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
