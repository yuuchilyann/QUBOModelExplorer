import { useMemo, useState } from 'react';
import {
  Alert,
  Box,
  Chip,
  Divider,
  MenuItem,
  Paper,
  Select,
  Stack,
  Tab,
  Tabs,
  Typography,
} from '@mui/material';
import CloudOffIcon from '@mui/icons-material/CloudOff';
import CloudQueueIcon from '@mui/icons-material/CloudQueue';

import type { QuboCase, QuboModel } from '../types';
import {
  buildIpynb,
  buildNotebook,
  emitTier1,
  emitTier2,
} from '../lib/python/emit';
import {
  SAMPLERS,
  TOKEN_SETUP,
  findSampler,
  packagesFor,
  type SamplerId,
} from '../lib/python/samplers';
import { CodePanel } from './CodePanel';
import { InstallBlock } from './InstallBlock';
import { JupyterPanel } from './JupyterPanel';
import { useI18n } from '../i18n';

export type CodeExportPanelProps = {
  qcase: QuboCase;
  model: QuboModel;
  /** Extra pip packages the domain view needs (e.g. networkx for graph cases). */
  extraPackages?: string[];
};

type Tier = 1 | 2;
type View = 'script' | 'jupyter';

/**
 * The code deliverable.
 *
 * Two tiers and a sampler selector. The tier axis is what the paper teaches
 * (a concrete Q versus the modelling recipe); the sampler axis is what makes
 * the "right bank is swappable" claim concrete — the same Q, different code.
 *
 * Regeneration is live rather than gated behind a button: unlike a decomposition
 * search, building a Q for these sizes costs microseconds, so watching the
 * constants in the emitted Python move as the penalty slider drags is free and
 * is itself part of the lesson.
 */
export function CodeExportPanel({ qcase, model, extraPackages = [] }: CodeExportPanelProps) {
  const { t } = useI18n();
  const [tier, setTier] = useState<Tier>(1);
  const [view, setView] = useState<View>('script');
  const [samplerId, setSamplerId] = useState<SamplerId>('exact');

  const spec = findSampler(samplerId);
  const packages = packagesFor(spec, extraPackages);

  const code = useMemo(
    () => (tier === 1 ? emitTier1(qcase, model, samplerId) : emitTier2(qcase, model, samplerId)),
    [qcase, model, samplerId, tier],
  );

  const cells = useMemo(
    () => buildNotebook(qcase, model, samplerId, tier, packages),
    [qcase, model, samplerId, tier, packages],
  );
  const ipynb = useMemo(() => buildIpynb(cells), [cells]);

  const filename = `${qcase.id}-tier${tier}-${samplerId}`;

  return (
    <Box>
      <Paper variant="outlined" sx={{ p: 1.5, mb: 2 }}>
        {/*
          The label sits ABOVE the row rather than inside the left column:
          stacking it with the Select would put the column's centre between the
          two, so a centred sibling chip ends up ~12px above the Select itself.
        */}
        <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 0.5 }}>
          {t('export.sampler')}
        </Typography>
        <Stack direction="row" spacing={2} sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1.5 }}>
          <Select
            size="small"
            value={samplerId}
            onChange={(e) => setSamplerId(e.target.value as SamplerId)}
            sx={{ minWidth: 300 }}
            renderValue={(v) => findSampler(v as SamplerId).label}
          >
            <MenuItem disabled dense>
              <Typography variant="caption" color="success.main">
                {t('export.sampler.local')}
              </Typography>
            </MenuItem>
            {SAMPLERS.filter((s) => !s.needsToken).map((s) => (
              <MenuItem key={s.id} value={s.id}>
                <Stack>
                  <Typography variant="body2">{s.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.limit}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
            <Divider />
            <MenuItem disabled dense>
              <Typography variant="caption" color="warning.main">
                {t('export.sampler.token')}
              </Typography>
            </MenuItem>
            {SAMPLERS.filter((s) => s.needsToken).map((s) => (
              <MenuItem key={s.id} value={s.id}>
                <Stack>
                  <Typography variant="body2">{s.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {s.limit}
                  </Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>

          <Chip
            size="small"
            color={spec.needsToken ? 'warning' : 'success'}
            variant="outlined"
            icon={spec.needsToken ? <CloudQueueIcon /> : <CloudOffIcon />}
            label={spec.needsToken ? t('export.sampler.token') : t('export.sampler.local')}
          />
        </Stack>

        {spec.needsToken && (
          <Alert severity="warning" sx={{ mt: 1.5, py: 0.5 }}>
            <Typography variant="caption">{t('export.sampler.tokenWarn')}</Typography>
          </Alert>
        )}
      </Paper>

      <Tabs value={tier} onChange={(_, v: Tier) => setTier(v)} sx={{ mb: 1 }}>
        <Tab value={1} label={t('export.tier1')} />
        <Tab value={2} label={t('export.tier2')} />
      </Tabs>
      <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 2 }}>
        {tier === 1 ? t('export.tier1.hint') : t('export.tier2.hint')}
      </Typography>

      <InstallBlock
        packages={packages}
        extraStep={
          spec.needsToken
            ? { label: String(t('export.tokenSetup.label')), command: TOKEN_SETUP }
            : undefined
        }
      />

      <Tabs value={view} onChange={(_, v: View) => setView(v)} sx={{ mb: 2 }}>
        <Tab value="script" label={t('export.script')} />
        <Tab value="jupyter" label={t('export.jupyter')} />
      </Tabs>

      {view === 'script' ? (
        <CodePanel code={code} filename={filename} />
      ) : (
        <JupyterPanel cells={cells} ipynb={ipynb} filename={filename} />
      )}
    </Box>
  );
}
