import { useThemeRepository } from '../repository/useThemeRepository';
import type { Theme, ThemePreference } from '../types/theme';

export function useThemeSwitch(): {
  viewModel: { theme: Theme; preference: ThemePreference; label: string; pressed: boolean; ready: boolean };
  toggle: () => void;
} {
  const { preference, theme, ready, setPreference } = useThemeRepository();
  return {
    viewModel: { theme, preference, label: 'Night edition', pressed: theme === 'dark', ready },
    toggle: () => setPreference(theme === 'dark' ? 'light' : 'dark'),
  };
}
