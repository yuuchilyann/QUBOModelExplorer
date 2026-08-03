import { useMemo } from 'react';
import {
  AppBar,
  Box,
  Button,
  Container,
  Divider,
  Stack,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

import { GROUP_ORDER, WALK_ORDER, casesInGroup, findCase } from './cases';
import { keyToRoute, routeKey, useHashRoute } from './hooks/useHashRoute';
import { LanguageSwitcher } from './components/LanguageSwitcher';
import { AppendixPage } from './pages/AppendixPage';
import { OverviewPage } from './pages/OverviewPage';
import { CasePage } from './pages/CasePage';
import { GroupPage } from './pages/GroupPage';
import { HelloWorldPage } from './pages/HelloWorldPage';
import { useI18n } from './i18n';
import type { CaseGroup } from './types';

const GROUP_NAV_KEY: Record<CaseGroup, 'app.nav.natural' | 'app.nav.knownPenalty' | 'app.nav.general'> =
  {
    natural: 'app.nav.natural',
    knownPenalty: 'app.nav.knownPenalty',
    general: 'app.nav.general',
  };

export function App() {
  const { t } = useI18n();
  const [route, navigate] = useHashRoute();

  /** Which top-level tab is highlighted for the current route. */
  const activeTab = useMemo(() => {
    if (route.kind === 'case') {
      const c = findCase(route.id);
      return c ? `group:${c.group}` : 'overview';
    }
    return routeKey(route);
  }, [route]);

  const walkIndex = WALK_ORDER.indexOf(routeKey(route));
  const prev = walkIndex > 0 ? WALK_ORDER[walkIndex - 1] : null;
  const next =
    walkIndex >= 0 && walkIndex < WALK_ORDER.length - 1 ? WALK_ORDER[walkIndex + 1] : null;

  return (
    <Box sx={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <AppBar position="sticky" color="default" elevation={0} sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Toolbar sx={{ gap: 2, flexWrap: 'wrap', rowGap: 1, py: 1 }}>
          <Stack sx={{ mr: 'auto' }}>
            <Typography variant="h1" sx={{ fontSize: '1.15rem' }}>
              {t('app.title')}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {t('app.subtitle')}
            </Typography>
          </Stack>
          <LanguageSwitcher />
        </Toolbar>

        <Tabs
          value={activeTab}
          onChange={(_, v: string) => navigate(keyToRoute(v))}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, minHeight: 44, borderTop: 1, borderColor: 'divider' }}
        >
          <Tab value="overview" label={t('app.nav.overview')} sx={{ minHeight: 44 }} />
          <Tab value="hello-world" label={t('app.nav.hello')} sx={{ minHeight: 44 }} />
          {GROUP_ORDER.map((g) => (
            <Tab
              key={g}
              value={`group:${g}`}
              label={t(GROUP_NAV_KEY[g])}
              sx={{ minHeight: 44 }}
            />
          ))}
          <Tab value="appendix" label={t('app.nav.appendix')} sx={{ minHeight: 44 }} />
        </Tabs>
      </AppBar>

      <Container maxWidth="lg" sx={{ flexGrow: 1, py: 4 }}>
        {route.kind === 'overview' && <OverviewPage />}
        {route.kind === 'hello' && <HelloWorldPage />}
        {route.kind === 'group' && (
          <GroupPage
            group={route.group as CaseGroup}
            cases={casesInGroup(route.group as CaseGroup)}
            onOpen={(id) => navigate({ kind: 'case', id })}
          />
        )}
        {route.kind === 'case' && <CasePage id={route.id} />}
        {route.kind === 'appendix' && <AppendixPage />}

        <Divider sx={{ mt: 5, mb: 2 }} />
        <Stack direction="row" sx={{ justifyContent: 'space-between', gap: 1, flexWrap: 'wrap' }}>
          <Button
            size="small"
            startIcon={<ChevronLeftIcon />}
            disabled={!prev}
            onClick={() => prev && navigate(keyToRoute(prev))}
          >
            {t('app.prev')}
          </Button>
          <Button
            size="small"
            endIcon={<ChevronRightIcon />}
            disabled={!next}
            onClick={() => next && navigate(keyToRoute(next))}
          >
            {t('app.next')}
          </Button>
        </Stack>
      </Container>

      <Box component="footer" sx={{ py: 2, borderTop: 1, borderColor: 'divider' }}>
        <Container maxWidth="lg">
          <Typography variant="caption" color="text.secondary">
            {t('app.footer', { year: new Date().getFullYear() })}
          </Typography>
        </Container>
      </Box>
    </Box>
  );
}
