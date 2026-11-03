import { useEffect, useState } from 'react';
import { create } from 'zustand';
import { createJSONStorage, persist, type StateStorage } from 'zustand/middleware';
import { themeEnvironmentAdapter } from '../adapter/themeEnvironmentAdapter';
import { themeStorageAdapter } from '../adapter/themeStorageAdapter';
import { parseStoredPreference, resolveTheme } from '../services/themeResolution';
import { THEME_STORAGE_KEY, type Theme, type ThemePreference } from '../types/theme';

type ThemeState = { preference: ThemePreference; setPreference: (preference: ThemePreference) => void };

// The stored value stays a plain "light" | "dark" | "system" string so the inline bootstrap can read it.
const stateStorage: StateStorage = {
  getItem: () => {
    const raw = themeStorageAdapter.read();
    return raw === null ? null : JSON.stringify({ state: { preference: parseStoredPreference(raw) }, version: 0 });
  },
  setItem: (_name, value) => {
    const parsed = JSON.parse(value) as { state: { preference: ThemePreference } };
    themeStorageAdapter.write(parsed.state.preference);
  },
  removeItem: () => {},
};

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({ preference: 'system', setPreference: (preference) => set({ preference }) }),
    {
      name: THEME_STORAGE_KEY,
      storage: createJSONStorage(() => stateStorage),
      partialize: (state) => ({ preference: state.preference }),
      skipHydration: true,
    },
  ),
);

export function useThemeRepository(): { preference: ThemePreference; theme: Theme; setPreference: (p: ThemePreference) => void } {
  const preference = useThemeStore((state) => state.preference);
  const setPreference = useThemeStore((state) => state.setPreference);
  const [hydrated, setHydrated] = useState(false);
  const [systemPrefersDark, setSystemPrefersDark] = useState(false);

  useEffect(() => {
    // Storage reads are synchronous, so the preference and the hydrated flag land in one render.
    const stopListening = useThemeStore.persist.onFinishHydration(() => setHydrated(true));
    void useThemeStore.persist.rehydrate();
    setSystemPrefersDark(themeEnvironmentAdapter.prefersDark());
    const stopWatching = themeEnvironmentAdapter.onSystemChange(setSystemPrefersDark);
    return () => {
      stopListening();
      stopWatching();
    };
  }, []);

  const theme = resolveTheme(preference, systemPrefersDark);
  useEffect(() => {
    if (hydrated) themeEnvironmentAdapter.apply(theme);
  }, [hydrated, theme]);

  return { preference, theme, setPreference };
}
