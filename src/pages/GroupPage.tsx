import { Box, Card, CardActionArea, CardContent, Chip, Stack, Typography } from '@mui/material';

import { derive } from '../lib/derive';
import { CaseScenarioLine, useCaseName } from '../components/CaseScenario';
import { PresenterNotes } from '../components/PresenterNotes';
import { SourceBadge } from '../components/SourceBadge';
import type { CaseGroup, QuboCase } from '../types';
import { useI18n } from '../i18n';

const TITLE_KEY = {
  natural: 'group.natural.title',
  knownPenalty: 'group.knownPenalty.title',
  general: 'group.general.title',
} as const;

const BODY_KEY = {
  natural: 'group.natural.body',
  knownPenalty: 'group.knownPenalty.body',
  general: 'group.general.body',
} as const;

const NOTES: Record<CaseGroup, React.ReactNode> = {
  natural: (
    <>
      這一組要建立的直覺是「Q 矩陣就是目標函數換個寫法」。沒有懲罰、沒有 slack，對角線是線性項、非對角線是二次項的一半，就這樣。
      <br />
      <br />
      Number Partitioning 值得多停一下：論文是從 <code>diff²</code>{' '}
      手推的，但本站把它表達成「Transformation #1 套在平衡等式{' '}
      <code>Σsⱼxⱼ = c/2</code> 上、P = 1」，推出來的 Q 一模一樣。這證明論文的「自然形式」和「通用配方」其實是同一件事的兩種說法。
    </>
  ),
  knownPenalty: (
    <>
      重點台詞：<strong>這些懲罰是精確的，不是近似的</strong>。傳統罰函數法只能逼近，這裡只要 P 夠大，QUBO 的最優解就<em>等於</em>原問題的最優解；可以在「解空間」分頁把最優解代回原始約束，看到全部滿足。
      <br />
      <br />
      Max 2-SAT 是這一組最好的展示品：拖 P 沒有用（它沒有 P），但它示範了「QUBO 大小只由變數數決定，與子句數無關」。現場多加幾個子句給觀眾看維度不變。
    </>
  ),
  general: (
    <>
      這一組是論文的技術核心。三個動作要講清楚：
      <br />
      1. 不等式 → 加 slack 變數變成等式（<code>≤</code> 加、<code>≥</code> 減）
      <br />
      2. slack 變數 → 二進位展開成幾個 0/1 位元
      <br />
      3. 等式 <code>Ax = b</code> → 懲罰 <code>P(Ax−b)ᵀ(Ax−b)</code>
      <br />
      <br />
      §5.2 Graph Colouring 是唯一同時用到 #1 和 #2 的案例，也是規模儀表最容易撞牆的案例（變數數 = 節點數 × 顏色數）。§5.4 QAP 則是 n² 成長。這兩個現場拉一下就會撞到組合爆炸。
    </>
  ),
};

/**
 * One case, as a browsable card.
 *
 * Its own component because `useCaseName` is a hook and the list below maps
 * over cases — calling it inside the map would break the rules of hooks.
 */
function CaseCard({ c, onOpen }: { c: QuboCase; onOpen: (id: string) => void }) {
  const { t } = useI18n();
  const name = useCaseName(c.id);
  const { model } = derive(c);
  const slack = model.n - c.model.numVars;

  return (
    <Card variant="outlined">
      <CardActionArea onClick={() => onOpen(c.id)}>
        <CardContent>
          <Stack
            direction="row"
            spacing={1}
            sx={{ alignItems: 'center', flexWrap: 'wrap', rowGap: 1, mb: 1 }}
          >
            <SourceBadge qcase={c} />
            <Typography variant="h3">{name ?? c.id}</Typography>
            <Box sx={{ flexGrow: 1 }} />
            <Chip
              size="small"
              variant="outlined"
              label={
                slack > 0
                  ? t('scale.varsWithSlack', { base: c.model.numVars, slack, n: model.n })
                  : t('scale.vars', { n: model.n })
              }
            />
            {c.penalty && (
              <Chip size="small" variant="outlined" label={`P = ${c.penalty.paperValue}`} />
            )}
            {c.editable && <Chip size="small" color="primary" label={t('editor.title')} />}
          </Stack>

          {/* The framing, so the list can be browsed without opening each case. */}
          <Box sx={{ mb: 1 }}>
            <CaseScenarioLine id={c.id} />
          </Box>

          <Typography variant="caption" color="text.secondary">
            {t('scale.states', { states: (2 ** model.n).toLocaleString() })} ·{' '}
            {c.model.sense === 'min' ? t('common.min') : t('common.max')} ·{' '}
            {c.model.constraints.length} {t('common.constraints')}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export type GroupPageProps = {
  group: CaseGroup;
  cases: QuboCase[];
  onOpen: (id: string) => void;
};

export function GroupPage({ group, cases, onOpen }: GroupPageProps) {
  const { t } = useI18n();

  return (
    <Box>
      <Typography variant="h1" sx={{ mb: 2 }}>
        {t(TITLE_KEY[group])}
      </Typography>
      <Typography variant="body1" component="div" sx={{ mb: 3 }}>
        {t(BODY_KEY[group])}
      </Typography>

      <Stack spacing={2}>
        {cases.map((c) => (
          <CaseCard key={c.id} c={c} onOpen={onOpen} />
        ))}
      </Stack>

      <PresenterNotes>{NOTES[group]}</PresenterNotes>
    </Box>
  );
}
