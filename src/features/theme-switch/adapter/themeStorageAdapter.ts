import { THEME_STORAGE_KEY, type ThemePreference } from '../types/theme';

export const themeStorageAdapter = {
  read(): string | null {
    try {
      return localStorage.getItem(THEME_STORAGE_KEY);
    } catch {
      return null;
    }
  },
  write(preference: ThemePreference): void {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, preference);
    } catch {
      // Storage blocked or full: the choice simply does not persist.
    }
  },
};
