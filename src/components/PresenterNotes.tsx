import type { ReactNode } from 'react';
import { Accordion, AccordionDetails, AccordionSummary, Stack, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import RecordVoiceOverIcon from '@mui/icons-material/RecordVoiceOver';

import { useI18n } from '../i18n';

/**
 * Collapsed-by-default notes for whoever is driving the walkthrough: the one
 * point to land on this page, and the questions it usually draws.
 */
export function PresenterNotes({ children }: { children: ReactNode }) {
  const { t } = useI18n();
  return (
    <Accordion
      disableGutters
      variant="outlined"
      sx={{ mt: 3, bgcolor: 'action.hover', '&:before': { display: 'none' } }}
    >
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center' }}>
          <RecordVoiceOverIcon fontSize="small" color="action" />
          <Typography variant="body2" sx={{ fontWeight: 500 }}>
            {t('notes.title')}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {t('notes.hint')}
          </Typography>
        </Stack>
      </AccordionSummary>
      <AccordionDetails>
        <Typography variant="body2" component="div" color="text.secondary">
          {children}
        </Typography>
      </AccordionDetails>
    </Accordion>
  );
}
