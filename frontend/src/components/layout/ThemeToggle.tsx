'use client';

import { useContext, useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { ThemeContext } from '@/providers/ThemeProvider';

export default function ThemeToggle() {
  const { resolvedTheme, setTheme } = useContext(ThemeContext);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const isDark = resolvedTheme === 'dark';
  if (!mounted) return <span data-testid="theme-toggle-placeholder" aria-hidden="true" className="inline-flex size-9" />;
  return (
    <button type="button" data-testid="theme-toggle-btn" aria-label={isDark ? 'Switch to light theme' : 'Switch to dark theme'} aria-pressed={isDark} onClick={() => setTheme(isDark ? 'light' : 'dark')} className="inline-flex size-9 items-center justify-center text-ink-2 hover:text-gold-2 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold">
      {isDark ? <Sun size={17} strokeWidth={1.5} aria-hidden="true" /> : <Moon size={17} strokeWidth={1.5} aria-hidden="true" />}
    </button>
  );
}