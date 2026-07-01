import { createContext, useContext, useEffect } from 'react';
import { useCmsContent } from './CmsContext';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const themeData = useCmsContent('theme');

  useEffect(() => {
    if (!themeData?.colors) return;
    const root = document.documentElement;
    Object.entries(themeData.colors || {}).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    Object.entries(themeData.fonts || {}).forEach(([key, value]) => {
      root.style.setProperty(`--font-${key}`, value);
    });
    Object.entries(themeData.spacing || {}).forEach(([key, value]) => {
      root.style.setProperty(`--spacing-${key}`, value);
    });
    Object.entries(themeData.radius || {}).forEach(([key, value]) => {
      root.style.setProperty(`--radius-${key}`, value);
    });
    Object.entries(themeData.shadows || {}).forEach(([key, value]) => {
      root.style.setProperty(`--shadow-${key}`, value);
    });
    Object.entries(themeData.transitions || {}).forEach(([key, value]) => {
      root.style.setProperty(`--transition-${key}`, value);
    });
    if (themeData.mobile) {
      Object.entries(themeData.mobile).forEach(([key, value]) => {
        root.style.setProperty(`--mobile-${key}`, value);
      });
    }
    if (themeData.desktop) {
      Object.entries(themeData.desktop).forEach(([key, value]) => {
        root.style.setProperty(`--desktop-${key}`, value);
      });
    }
  }, [themeData]);

  return (
    <ThemeContext.Provider value={{ theme: themeData }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
