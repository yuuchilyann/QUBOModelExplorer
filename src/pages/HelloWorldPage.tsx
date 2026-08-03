import { useMemo, useState } from 'react';
import {
  Box,
  Chip,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';

import { helloWorld } from '../cases';
import { applyEdit } from '../cases/mutate';
import { derive } from '../lib/derive';
import { evaluate } from '../lib/qubo';
import { useSolver } from '../hooks/useSolver';
import { CodeExportPanel } from '../components/CodeExportPanel';
import { HelloEditor } from '../components/CaseEditors';
import { PresenterNotes } from '../components/PresenterNotes';
import { QMatrixView } from '../components/QMatrixView';
import { QuadraticFormLatex } from '../components/QMatrixLatex';
import { SourceBadge } from '../components/SourceBadge';
import { VerificationChip, type VerificationStatus } from '../components/VerificationChip';
import { useI18n } from '../i18n';

/**
 * Every assignment, laid out.
 *
 * Four variables means sixteen rows, which is the only case in the whole site
 * where the ENTIRE search space fits on screen at once. Seeing the optimum as
 * one row among sixteen — rather than as an answer handed down by a solver — is
 * the point of the page.
 */
function AllStatesTable({ Q, sense }: { Q: number[][]; sense: 'min' | 'max' }) {
  const { t } = useI18n();
  const n = Q.length;
  const rows = useMemo(() => {
    const out = Array.from({ length: 2 ** n }, (_, m) => {
      const x = Array.from({ length: n }, (_, i) => (m >> i) & 1);
      return { x, y: evaluate(Q, x) };
    });
    const best = out.reduce(
      (acc, r) => (sense === 'min' ? Math.min(acc, r.y) : Math.max(acc, r.y)),
      sense === 'min' ? Infinity : -Infinity,
    );
    return out.map((r) => ({ ...r, best: r.y === best }));
  }, [Q, n, sense]);

  return (
    <Paper variant="outlined" sx={{ maxHeight: 520, overflow: 'auto' }}>
      <Table size="small" stickyHeader>
        <TableHead>
          <TableRow>
            {Array.from({ length: n }, (_, i) => (
              <TableCell key={i} align="center" sx={{ py: 0.5 }}>
                x{i + 1}
              </TableCell>
            ))}
            <TableCell align="right" sx={{ py: 0.5 }}>
              {t('solutions.energy')}
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((r, i) => (
            <TableRow
              key={i}
              sx={{
                bgcolor: r.best ? 'success.light' : undefined,
                '& td': { py: 0.35 },
              }}
            >
              {r.x.map((v, k) => (
                <TableCell key={k} align="center" sx={{ fontFamily: 'monospace' }}>
                  {v}
                </TableCell>
              ))}
              <TableCell
                align="right"
                sx={{ fontFamily: 'monospace', fontWeight: r.best ? 700 : 400 }}
              >
                {r.y}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}

export function HelloWorldPage() {
  const { t } = useI18n();
  const [linear, setLinear] = useState([...helloWorld.model.linear]);
  const [quadratic, setQuadratic] = useState(helloWorld.model.quadratic.map((q) => ({ ...q })));

  const pristine =
    JSON.stringify(linear) === JSON.stringify(helloWorld.model.linear) &&
    JSON.stringify(quadratic) === JSON.stringify(helloWorld.model.quadratic);

  const qcase = useMemo(
    () => (pristine ? helloWorld : applyEdit(helloWorld, { kind: 'hello', linear, quadratic })),
    [pristine, linear, quadratic],
  );
  const { model } = useMemo(() => derive(qcase), [qcase]);
  const solve = useSolver(model, qcase.model);

  const restore = () => {
    setLinear([...helloWorld.model.linear]);
    setQuadratic(helloWorld.model.quadratic.map((q) => ({ ...q })));
  };

  const status: VerificationStatus = pristine
    ? { kind: 'matches', n: model.n, constant: model.constant }
    : { kind: 'custom' };

  return (
    <Box>
      <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 2, flexWrap: 'wrap' }}>
        <Typography variant="h1">{t('hello.title')}</Typography>
        <SourceBadge qcase={helloWorld} />
      </Stack>

      <Typography variant="body1" component="div" sx={{ mb: 3 }}>
        {t('hello.lead')}
      </Typography>

      {/* ── three lessons ── */}
      <Stack spacing={2} sx={{ mb: 4 }}>
        {(
          [
            ['hello.lesson1.title', 'hello.lesson1.body'],
            ['hello.lesson2.title', 'hello.lesson2.body'],
            ['hello.lesson3.title', 'hello.lesson3.body'],
          ] as const
        ).map(([title, body], i) => (
          <Paper key={title} variant="outlined" sx={{ p: 2 }}>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: 'flex-start' }}>
              <Chip size="small" color="primary" label={i + 1} />
              <Box>
                <Typography variant="h3" sx={{ mb: 0.5 }}>
                  {t(title)}
                </Typography>
                <Typography variant="body2" component="div" color="text.secondary">
                  {t(body)}
                </Typography>
              </Box>
            </Stack>
          </Paper>
        ))}
      </Stack>

      {/* ── live playground: coefficients → Q → the whole space ── */}
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('hello.tryIt')}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        {t('hello.tryItBody')}
      </Typography>

      <Box sx={{ mb: 2 }}>
        <VerificationChip status={status} onRestore={pristine ? undefined : restore} />
      </Box>

      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} sx={{ mb: 4 }}>
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <HelloEditor
            linear={linear}
            quadratic={quadratic}
            onChange={(l, q) => {
              setLinear(l);
              setQuadratic(q);
            }}
          />
          {/* The paper's own presentation, for direct comparison with the PDF. */}
          <Paper variant="outlined" sx={{ p: 2, mt: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
              {t('hello.paperForm')}
            </Typography>
            <QuadraticFormLatex model={model} />
            <Typography variant="caption" component="div" color="text.secondary">
              {t('hello.paperFormBody')}
            </Typography>
          </Paper>

          <Box sx={{ mt: 2 }}>
            <QMatrixView model={model} paperQ={pristine ? helloWorld.paperQ : undefined} />
          </Box>
        </Box>
        <Box sx={{ width: { xs: '100%', lg: 320 }, flexShrink: 0 }}>
          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            {t('hello.allStates')}
          </Typography>
          <AllStatesTable Q={model.Q} sense={model.sense} />
        </Box>
      </Stack>

      {/* ── run it for real ── */}
      <Typography variant="h2" sx={{ mb: 1 }}>
        {t('hello.runIt')}
      </Typography>

      {/*
        The heading promises a run, so show one. These figures come from the
        Web Worker that just swept the space — the Python below is the same
        computation moved into the reader's own environment, not the only place
        the problem is actually solved.
      */}
      <Paper variant="outlined" sx={{ p: 2, mb: 2 }}>
        <Stack direction="row" spacing={1} sx={{ alignItems: 'center', mb: 1, flexWrap: 'wrap' }}>
          <Typography variant="subtitle2">{t('hello.browserRun')}</Typography>
          {solve.result && (
            <Chip
              size="small"
              color={solve.result.quality === 'exact' ? 'success' : 'warning'}
              label={
                solve.result.quality === 'exact' ? t('solutions.exact') : t('solutions.heuristic')
              }
            />
          )}
        </Stack>

        {solve.running || !solve.result ? (
          <Typography variant="body2" color="text.secondary">
            {t('solutions.running')}
          </Typography>
        ) : (
          <>
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 1.5,
                bgcolor: 'background.default',
                border: 1,
                borderColor: 'divider',
                borderRadius: 1,
                fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
                fontSize: 13,
                lineHeight: 1.6,
                overflowX: 'auto',
              }}
            >
              <code>
                {`x          = [${solve.result.best[0].x.join(', ')}]\n` +
                  `x^T Q x    = ${solve.result.best[0].energy}\n` +
                  `original y = ${solve.result.best[0].energy + model.constant}`}
              </code>
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 1 }}>
              {t('solutions.evaluated', {
                count: solve.result.evaluated.toLocaleString(),
                ms: solve.result.elapsedMs,
              })}
              {' · '}
              {solve.result.degeneracy > 1
                ? t('solutions.degeneracy', { count: solve.result.degeneracy })
                : t('solutions.unique')}
            </Typography>
            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 0.5 }}>
              {t('hello.browserRunHint')}
            </Typography>
          </>
        )}
      </Paper>

      <Typography variant="body2" component="div" color="text.secondary" sx={{ mb: 2 }}>
        {t('hello.runItBody')}
      </Typography>
      {/*
        Driven by THIS page's state, not a fresh copy of the pristine case, so
        the emitted Python always matches the matrix and the table above it.
        A second CaseWorkbench here would both duplicate the editor and quietly
        export the paper's Q after the reader had edited the coefficients.
      */}
      <CodeExportPanel qcase={qcase} model={model} />

      <PresenterNotes>
        這一頁是全站唯一「手把手教怎麼跑起來」的地方，後面每一頁都假設觀眾已經會了。
        <br />
        <br />
        建議流程：先念三個 lesson（約 2 分鐘），再現場改一個係數讓大家看右邊 16 列整張表即時重算，這一步最能建立「Q 矩陣就是目標函數」的直覺。最後把程式碼複製到 Colab 真的跑一次，讓大家看到 y = −11 出現在輸出裡。
        <br />
        <br />
        強調 <code>dimod.ExactSolver</code> <strong>不需要任何帳號或 API token</strong>。後面每一頁的程式碼都可以照樣貼進去跑，這不是示意用的假程式碼。
      </PresenterNotes>
    </Box>
  );
}
