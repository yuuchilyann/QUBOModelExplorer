import { useMemo, useState } from 'react';
import { Box, IconButton, Snackbar, Stack, Tooltip } from '@mui/material';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DownloadIcon from '@mui/icons-material/Download';
import Prism from 'prismjs';
import 'prismjs/components/prism-python';
// Token colours only — the theme's `.token.*` rules are global, so the MUI
// <pre> styling (background, font) is kept and only the spans get coloured.
import 'prismjs/themes/prism.css';

import { useI18n } from '../i18n';

export type CodePanelProps = {
  code: string;
  /** Filename without extension; `.py` is appended on download. */
  filename: string;
};

/**
 * Read-only Python viewer with a flat copy/download overlay pinned top-right —
 * the text equivalent of a diagram's export affordance, so code and figure tabs
 * feel the same.
 */
export function CodePanel({ code, filename }: CodePanelProps) {
  const { tStr } = useI18n();
  const [toast, setToast] = useState<{ open: boolean; msg: string }>({
    open: false,
    msg: '',
  });
  const flash = (msg: string) => setToast({ open: true, msg });

  const highlighted = useMemo(
    () => Prism.highlight(code, Prism.languages.python, 'python'),
    [code],
  );

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      flash(tStr('export.toast.codeCopied'));
    } catch (e) {
      flash(tStr('export.toast.copyFailed', { error: (e as Error).message }));
    }
  };

  const onDownload = () => {
    try {
      const blob = new Blob([code], { type: 'text/x-python;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${filename}.py`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
      flash(tStr('export.toast.pyDownloaded', { filename }));
    } catch (e) {
      flash(tStr('export.toast.downloadFailed', { error: (e as Error).message }));
    }
  };

  return (
    <Box sx={{ position: 'relative' }}>
      <Box
        component="pre"
        sx={{
          m: 0,
          overflow: 'auto',
          maxWidth: '100%',
          maxHeight: 560,
          bgcolor: 'background.default',
          border: 1,
          borderColor: 'divider',
          borderRadius: 1,
          pt: 5,
          px: 2,
          pb: 2,
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
          fontSize: 13,
          lineHeight: 1.55,
          color: 'text.primary',
        }}
      >
        <code dangerouslySetInnerHTML={{ __html: highlighted }} />
      </Box>
      <Box sx={{ position: 'absolute', top: 6, right: 6, zIndex: 2 }}>
        <Stack direction="row" spacing={0.5} sx={{ alignItems: 'center' }}>
          <Tooltip title={tStr('export.copyCode.tooltip')}>
            <IconButton size="small" onClick={onCopy} aria-label="copy code">
              <ContentCopyIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={tStr('export.download.py.tooltip')}>
            <IconButton size="small" onClick={onDownload} aria-label="download python file">
              <DownloadIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      </Box>
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
