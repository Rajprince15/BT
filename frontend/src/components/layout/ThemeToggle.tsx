'use client';

import { useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);

  // Avoid SSR / client mismatch: only resolve the real theme after mount.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === 'dark';

  if (!mounted) {
    return (
      <span
        data-testid="theme-toggle-placeholder"
        aria-hidden="true"
        className="inline-flex h-9 w-9 rounded-full border border-[var(--border)]"
      />
    );
  }

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
      {isDark ? (
        <Sun size={16} aria-hidden="true" />
      ) : (
        <Moon size={16} aria-hidden="true" />
      )}
    </button>
  );
}
