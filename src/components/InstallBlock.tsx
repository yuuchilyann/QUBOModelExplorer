import { useState } from 'react';
import {
  Box,
  IconButton,
  Snackbar,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Tooltip,
  Typography,
} from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import { installCommand, type EnvKey } from '../lib/python/samplers';
import { useI18n } from '../i18n';

const ENVS: EnvKey[] = ['pip', 'conda', 'uv'];

export type InstallBlockProps = {
  packages: string[];
  /** Extra shell step (credential setup) shown below the install line. */
  extraStep?: { label: string; command: string };
};

/**
 * Shell install commands.
 *
 * These are shell, not Python, so they live in their own block above the code
 * rather than inside the `.py`. Package names are spelled out instead of using
 * `[extras]` syntax, because square brackets are glob characters in zsh and
 * PowerShell and would otherwise need per-shell quoting.
 */
export function InstallBlock({ packages, extraStep }: InstallBlockProps) {
  const { t, tStr } = useI18n();
  const [env, setEnv] = useState<EnvKey>('pip');
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({ open: false, msg: '' });

  const cmd = installCommand(env, packages);

  const copy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToast({ open: true, msg: tStr('export.toast.installCopied') });
    } catch (e) {
      setToast({
        open: true,
        msg: tStr('export.toast.copyFailed', { error: (e as Error).message }),
      });
    }
  };

  return (
    <Box sx={{ mb: 2, border: 1, borderColor: 'divider', borderRadius: 1, overflow: 'hidden' }}>
      <Stack
        direction="row"
        spacing={1}
        sx={{
          alignItems: 'center',
          flexWrap: 'wrap',
          rowGap: 0.5,
          px: 1,
          py: 0.5,
          bgcolor: 'action.hover',
        }}
      >
        <Typography variant="caption" color="text.secondary">
          {t('export.install.label')}
        </Typography>
        <ToggleButtonGroup
          value={env}
          exclusive
          size="small"
          onChange={(_, v: EnvKey | null) => v && setEnv(v)}
          color="primary"
        >
          {ENVS.map((e) => (
            <ToggleButton key={e} value={e} sx={{ px: 1, py: 0.25 }}>
              {e}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
        <Box sx={{ flexGrow: 1 }} />
        <Tooltip title={tStr('export.install.copy.tooltip')}>
          <IconButton size="small" onClick={() => copy(cmd)} aria-label="copy install command">
            <ContentCopyIcon fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Box
        component="pre"
        sx={{
          m: 0,
          px: 2,
          py: 1.25,
          overflow: 'auto',
          bgcolor: 'background.default',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 13,
          lineHeight: 1.5,
          color: 'text.primary',
        }}
      >
        <code>{cmd}</code>
      </Box>

      {extraStep && (
        <>
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ display: 'block', px: 2, pt: 1 }}
          >
            {extraStep.label}
          </Typography>
          <Box
            component="pre"
            sx={{
              m: 0,
              px: 2,
              py: 1,
              overflow: 'auto',
              bgcolor: 'background.default',
              fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
              fontSize: 13,
              color: 'text.primary',
            }}
          >
            <code>{extraStep.command}</code>
          </Box>
        </>
      )}

      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', px: 2, py: 1 }}>
        {t('export.install.hint')}
      </Typography>

      <Snackbar
        open={toast.open}
        autoHideDuration={2500}
        onClose={() => setToast({ ...toast, open: false })}
        message={toast.msg}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Box>
  );
}
