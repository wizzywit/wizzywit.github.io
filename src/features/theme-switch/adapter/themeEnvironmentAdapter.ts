import { THEME_ATTRIBUTE, type Theme } from '../types/theme';

const QUERY = '(prefers-color-scheme: dark)';

export const themeEnvironmentAdapter = {
  prefersDark(): boolean {
    return typeof window.matchMedia === 'function' && window.matchMedia(QUERY).matches;
  },
  onSystemChange(listener: (prefersDark: boolean) => void): () => void {
    if (typeof window.matchMedia !== 'function') return () => {};
    const query = window.matchMedia(QUERY);
    const handler = (event: MediaQueryListEvent) => listener(event.matches);
    query.addEventListener('change', handler);
    return () => query.removeEventListener('change', handler);
  },
  apply(theme: Theme): void {
    document.documentElement.setAttribute(THEME_ATTRIBUTE, theme);
  },
};
