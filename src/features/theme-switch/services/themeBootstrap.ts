import { THEME_ATTRIBUTE, THEME_STORAGE_KEY } from '../types/theme';

/**
 * Script text inlined in <head> so the stored theme applies before first paint.
 * Documented exception: this string is the only code outside the adapter that reads the stored theme.
 */
export function buildThemeBootstrapScript(storageKey: string, attribute: string): string {
  return [
    '(function () {',
    `  try { var t = localStorage.getItem(${JSON.stringify(storageKey)});`,
    `    if (t === "light" || t === "dark") document.documentElement.setAttribute(${JSON.stringify(attribute)}, t);`,
    '  } catch (e) {}',
    '})();',
  ].join('\n');
}

export const themeBootstrapScript = buildThemeBootstrapScript(THEME_STORAGE_KEY, THEME_ATTRIBUTE);
