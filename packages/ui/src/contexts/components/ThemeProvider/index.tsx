import { useEffect, useMemo, useState } from 'react';

import { getSystemTheme } from '../../helpers/getSystemTheme';
import type { ThemeMode } from '../../types';
import { ThemeContext } from './ThemeContext';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  storageKey?: string;
  syncWithSystem?: boolean;
};

export function ThemeProvider({
  children,
  defaultTheme,
  storageKey = 'theme',
  syncWithSystem = true,
}: ThemeProviderProps) {
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window === 'undefined') return defaultTheme ?? 'light';

    const stored = storageKey ? localStorage.getItem(storageKey) : null;

    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    return defaultTheme ?? getSystemTheme();
  });

  // Persist theme
  useEffect(() => {
    if (!storageKey) return;
    localStorage.setItem(storageKey, theme);
  }, [theme, storageKey]);

  // Sync with prefers-color-scheme
  useEffect(() => {
    if (!syncWithSystem || storageKey) return;

    const media = window.matchMedia('(prefers-color-scheme: dark)');

    const handler = (e: MediaQueryListEvent) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    media.addEventListener('change', handler);
    return () => media.removeEventListener('change', handler);
  }, [syncWithSystem, storageKey]);

  // Apply theme to DOM
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme: () => setTheme((t) => (t === 'light' ? 'dark' : 'light')),
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
  );
}
