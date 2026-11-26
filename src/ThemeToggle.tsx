import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';

type Theme = 'dark' | 'light';

const THEME_STORAGE_KEY = 'theme';
const COLOR_SCHEME_QUERY = '(prefers-color-scheme: dark)';

function getStoredTheme(): Theme | null {
  try {
    const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'dark' || stored === 'light') {
      return stored;
    }
  } catch {
    // Ignore storage access issues in restricted contexts
  }
  return null;
}

function getSystemTheme(): Theme {
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia(COLOR_SCHEME_QUERY).matches ? 'dark' : 'light';
  }
  return 'dark';
}

function applyThemeToDocument(theme: Theme): void {
  const root = document.documentElement;
  if (theme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export function ThemeToggle() {
  const [hasManualOverride, setHasManualOverride] = useState<boolean>(() => getStoredTheme() !== null);
  const [theme, setTheme] = useState<Theme>(() => getStoredTheme() ?? getSystemTheme());

  // Sync document class whenever theme changes
  useEffect(() => {
    applyThemeToDocument(theme);
  }, [theme]);

  // Listen dynamically for OS color scheme changes when no manual override is saved
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;

    const mediaQuery = window.matchMedia(COLOR_SCHEME_QUERY);

    const handleSystemChange = (event: MediaQueryListEvent) => {
      if (getStoredTheme() !== null) return;
      const nextTheme: Theme = event.matches ? 'dark' : 'light';
      setHasManualOverride(false);
      setTheme(nextTheme);
    };

    mediaQuery.addEventListener('change', handleSystemChange);
    return () => {
      mediaQuery.removeEventListener('change', handleSystemChange);
    };
  }, []);

  // Listen for cross-tab localStorage theme updates
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key !== THEME_STORAGE_KEY) return;
      if (event.newValue === 'dark' || event.newValue === 'light') {
        setHasManualOverride(true);
        setTheme(event.newValue);
      } else {
        setHasManualOverride(false);
        setTheme(getSystemTheme());
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleToggle = useCallback(() => {
    setTheme((prev) => {
      const nextTheme: Theme = prev === 'dark' ? 'light' : 'dark';
      try {
        window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
      } catch {
        // Ignore storage write errors
      }
      setHasManualOverride(true);
      return nextTheme;
    });
  }, []);

  const isDark = theme === 'dark';
  const modeLabel = hasManualOverride ? 'manual' : 'system';
  const ariaLabel = `Switch to ${isDark ? 'light' : 'dark'} theme (currently ${theme}, ${modeLabel})`;

  return (
    <motion.button
      id="btn-theme-toggle"
      type="button"
      onClick={handleToggle}
      aria-label={ariaLabel}
      aria-pressed={isDark}
      title={`Theme: ${isDark ? 'Dark' : 'Light'} (${hasManualOverride ? 'Manual' : 'System'}) — Click to switch`}
      whileHover={{ scale: 1.06 }}
      whileTap={{ scale: 0.92 }}
      transition={{ type: 'spring', stiffness: 420, damping: 24 }}
      className="relative m3-pill w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-700/20 overflow-hidden cursor-pointer"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={theme}
          initial={{ rotate: -180, opacity: 0, scale: 0.55 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          exit={{ rotate: 180, opacity: 0, scale: 0.55 }}
          transition={{
            type: 'spring',
            stiffness: 230,
            damping: 19,
            mass: 0.85,
          }}
          className="absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          {isDark ? (
            <Sun className="w-4 h-4 text-amber-400" strokeWidth={2.25} />
          ) : (
            <Moon className="w-4 h-4 text-indigo-600" strokeWidth={2.25} />
          )}
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
