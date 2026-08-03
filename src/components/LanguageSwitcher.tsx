import { ToggleButton, ToggleButtonGroup } from '@mui/material';

import { LANGS, LANG_LABELS, useI18n } from '../i18n';
import type { Lang } from '../i18n';

export function LanguageSwitcher() {
  const { lang, setLang } = useI18n();
  return (
    <ToggleButtonGroup
      value={lang}
      exclusive
      size="small"
      onChange={(_, v: Lang | null) => v && setLang(v)}
      aria-label="language"
    >
      {LANGS.map((l) => (
        <ToggleButton key={l} value={l} sx={{ px: 1, py: 0.25, fontSize: 12 }}>
          {LANG_LABELS[l]}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
