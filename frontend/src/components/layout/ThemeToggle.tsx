'use client';

import { useContext } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const resolved =
    theme === 'system'
      ? typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  const isDark = resolved === 'dark';

  return (
    <button
      type="button"
      data-testid="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
      style={{ transition: 'color 200ms, border-color 200ms, background-color 200ms' }}
    >
      {isDark ? <Sun size={16} aria-hidden="true" /> : <Moon size={16} aria-hidden="true" />}
    </button>
  );
}
