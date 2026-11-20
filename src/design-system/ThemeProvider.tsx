import { createContext, useContext, useState, type ReactNode } from 'react';
import { lightTheme, darkTheme, type Theme } from './theme';

interface ThemeContextValue {
  theme: Theme;
  toggle: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(() => {
    if (typeof localStorage === 'undefined') return false;
    return localStorage.getItem('mayaduels.theme') === 'dark';
  });

  const value: ThemeContextValue = {
    theme: isDark ? darkTheme : lightTheme,
    toggle: () => {
      setIsDark((d) => {
        const next = !d;
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem('mayaduels.theme', next ? 'dark' : 'light');
        }
        return next;
      });
    },
  };

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme() must be used within ThemeProvider');
  return ctx;
}
