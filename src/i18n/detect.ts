import type { Lang } from './types';

export const STORAGE_KEY = 'qme.lang';

/** A persisted manual choice wins; otherwise detect from the browser. */
export function detectInitialLang(): Lang {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'zh-Hant' || saved === 'en') return saved;
  } catch {
    /* localStorage unavailable (private mode) — fall through */
  }
  const prefs =
    typeof navigator !== 'undefined'
      ? navigator.languages && navigator.languages.length > 0
        ? navigator.languages
        : [navigator.language || '']
      : [];
  for (const tag of prefs) {
    const lower = tag.toLowerCase();
    if (lower.startsWith('zh')) return 'zh-Hant';
    if (lower.startsWith('en')) return 'en';
  }
  return 'zh-Hant';
}
