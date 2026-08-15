'use client';

import React, { createContext, useEffect, useState } from 'react';

const STORAGE_KEY = 'bt_theme';
export type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
}>({ theme: 'system', resolvedTheme: 'light', setTheme: () => {} });

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    let initialTheme: Theme = 'system';
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY);
      if (saved === 'light' || saved === 'dark' || saved === 'system') {
        initialTheme = saved;
      }
    } catch {
      // ignore
    }

    const initialResolved = initialTheme === 'system' ? getSystemTheme() : initialTheme;
    setTheme(initialTheme);
    setResolvedTheme(initialResolved);
    document.documentElement.setAttribute('data-theme', initialResolved);
    setInitialized(true);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const applied = theme === 'system' ? getSystemTheme() : theme;
    setResolvedTheme(applied);
    document.documentElement.setAttribute('data-theme', applied);
    try {
      window.localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // ignore
    }
  }, [initialized, theme]);

  useEffect(() => {
    if (!initialized || theme !== 'system') return;
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const listener = (event: MediaQueryListEvent) => {
      const nextTheme = event.matches ? 'dark' : 'light';
      setResolvedTheme(nextTheme);
      document.documentElement.setAttribute('data-theme', nextTheme);
    };
    mql.addEventListener('change', listener);
    return () => mql.removeEventListener('change', listener);
  }, [initialized, theme]);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
