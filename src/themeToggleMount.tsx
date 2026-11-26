import { createRoot } from 'react-dom/client';
import { ThemeToggle } from './ThemeToggle';

function mountThemeToggle() {
  const container = document.getElementById('theme-toggle-root');
  if (!container) return;
  createRoot(container).render(<ThemeToggle />);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', mountThemeToggle, { once: true });
} else {
  mountThemeToggle();
}
