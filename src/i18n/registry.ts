import type { Lang } from './types';
import type { Dictionary } from './locales/zh';
import { zh } from './locales/zh';
import { en } from './locales/en';

/**
 * The ONLY place to touch when adding a language: register its module here and
 * add its code to the `Lang` union in types.ts. No component changes needed.
 *
 * The map's value type is `Partial` so a new locale can ship incrementally,
 * falling back to zh for anything it has not translated. `en` opts out of that
 * licence by typing itself as the full `Dictionary` (see locales/en.tsx).
 */
export const LOCALES: Record<Lang, Partial<Dictionary>> = {
  'zh-Hant': zh,
  en,
};

/** Display order of languages in the switcher. */
export const LANGS: Lang[] = ['zh-Hant', 'en'];

export const LANG_LABELS: Record<Lang, string> = {
  'zh-Hant': '繁中',
  en: 'EN',
};
