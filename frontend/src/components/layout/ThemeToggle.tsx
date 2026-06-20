'use client';

import { useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const { theme, setTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  // Avoid SSR / client mismatch: only resolve the real theme after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  const resolved =
    !mounted || theme === 'system'
      ? mounted &&
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : theme;
  const isDark = mounted && resolved === 'dark';

  return (
    <button
      type="button"
      data-testid="theme-toggle-btn"
      aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
      className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[var(--border)] text-[var(--ink)] hover:border-[var(--gold)] hover:text-[var(--gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--gold)]"
      style={{ transition: 'color 200ms, border-color 200ms, background-color 200ms' }}
      suppressHydrationWarning
    >
      {/* Render a stable icon on the server + first client paint to keep the
          SSR HTML and the first client HTML identical. The icon then swaps
          after the component mounts on the client. */}
      {!mounted ? (
        <Moon size={16} aria-hidden="true" suppressHydrationWarning />
      ) : isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}
