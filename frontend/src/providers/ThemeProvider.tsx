
'use client';

import React, { createContext, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark' | 'system';

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light';

  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export const ThemeContext = createContext<{
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (t: Theme) => void;
}>({
  theme: 'light',
  resolvedTheme: 'light',
  setTheme: () => {},
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always start with light mode
  const [theme, setTheme] = useState<Theme>('light');
  const [resolvedTheme, setResolvedTheme] =
    useState<'light' | 'dark'>('light');
  const [initialized, setInitialized] = useState(false);

  // Force light mode on every page load.
  // Ignore localStorage and the user's OS/browser theme.
  useEffect(() => {
    setTheme('light');
    setResolvedTheme('light');

    document.documentElement.setAttribute('data-theme', 'light');

    setInitialized(true);
  }, []);

  // Apply the currently selected theme.
  // The theme can be changed during the current session,
  // but it will NOT be saved to localStorage.
  useEffect(() => {
    if (!initialized) return;

    const applied =
      theme === 'system' ? getSystemTheme() : theme;

    setResolvedTheme(applied);

    document.documentElement.setAttribute(
      'data-theme',
      applied
    );
  }, [initialized, theme]);

  // If the user selects "system" during the session,
  // follow the OS/browser theme.
  useEffect(() => {
    if (!initialized || theme !== 'system') return;

    const mql = window.matchMedia(
      '(prefers-color-scheme: dark)'
    );

    const listener = (event: MediaQueryListEvent) => {
      const nextTheme = event.matches ? 'dark' : 'light';

      setResolvedTheme(nextTheme);

      document.documentElement.setAttribute(
        'data-theme',
        nextTheme
      );
    };

    mql.addEventListener('change', listener);

    return () => {
      mql.removeEventListener('change', listener);
    };
  }, [initialized, theme]);

  return (
    <ThemeContext.Provider
      value={{
        theme,
        resolvedTheme,
        setTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}
