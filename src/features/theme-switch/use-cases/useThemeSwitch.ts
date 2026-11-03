import { useThemeRepository } from '../repository/useThemeRepository';
import type { Theme, ThemePreference } from '../types/theme';

export function useThemeSwitch(): {
  viewModel: { theme: Theme; preference: ThemePreference; label: string; ready: boolean };
  toggle: () => void;
} {
  const { preference, theme, ready, setPreference } = useThemeRepository();
  return {
    viewModel: { theme, preference, label: theme === 'dark' ? 'Day edition' : 'Night edition', ready },
    toggle: () => setPreference(theme === 'dark' ? 'light' : 'dark'),
  };
}
