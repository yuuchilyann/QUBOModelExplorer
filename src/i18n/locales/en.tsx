import type { Dictionary } from './zh';

/**
 * English — deliberately PARTIAL in the first release.
 *
 * `I18nProvider` falls back to the canonical zh entry for any key absent here,
 * so English can be filled in incrementally without touching a single
 * component. Adding a key is the whole job.
 */
export const en: Partial<Dictionary> = {
  'meta.title': 'QUBO Model Explorer',
  'meta.description':
    'QUBO Model Explorer — an interactive companion to Glover, Kochenberger & Du on formulating QUBO models.',

  'app.title': 'QUBO Model Explorer',
  'app.subtitle': 'A Tutorial on Formulating and Using QUBO Models',
  'app.nav.overview': 'Overview',
  'app.nav.hello': 'Hello World',
  'app.nav.natural': 'A · Natural form',
  'app.nav.knownPenalty': 'B · Known penalties',
  'app.nav.general': 'C · General transformations',
  'app.nav.appendix': 'Appendix',
  'app.prev': 'Previous',
  'app.next': 'Next',

  'notes.title': 'Presenter notes',

  'verify.matches': 'matches paper',
  'verify.mismatch': 'differs from paper',
  'verify.custom': 'custom input (no paper reference)',
  'verify.restore': 'Restore the paper’s data',

  'case.tab.formulation': 'Formulation',
  'case.tab.matrix': 'Q matrix',
  'case.tab.solutions': 'Solution space',
  'case.tab.domain': 'Problem view',
  'case.tab.code': 'Code',

  'solutions.exact': 'exhaustive (exact)',
  'solutions.heuristic': 'heuristic (best found)',

  'export.tier1': 'This problem',
  'export.tier2': 'Modelling function',
  'export.script': 'Python script',
  'export.jupyter': 'Jupyter / Colab',
  'export.sampler': 'Sampler',
  'export.install.label': 'Install',
  'export.download.ipynb.btn': 'Download .ipynb',

  'common.min': 'minimise',
  'common.max': 'maximise',
};
