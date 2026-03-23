import { useEffect, useState, useCallback } from 'react';

export type Theme = 'system' | 'light' | 'dark';

const STORAGE_KEY = 'theme';

function getSystemTheme(): 'light' | 'dark' {
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

function applyTheme(theme: Theme) {
  const resolved = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.classList.toggle('dark', resolved === 'dark');
}

export function useTheme() {
  const [theme, setThemeState] = useState<Theme>(() => {
    const stored = localStorage.getItem(STORAGE_KEY) as Theme | null;
    return stored ?? 'system';
  });

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    if (next === 'system') {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, next);
    }
    applyTheme(next);
  }, []);

  useEffect(() => {
    applyTheme(theme);
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => {
      if (theme === 'system') applyTheme('system');
    };
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [theme]);

  const resolvedTheme: 'light' | 'dark' =
    theme === 'system' ? getSystemTheme() : theme;

  return { theme, setTheme, resolvedTheme };
}
