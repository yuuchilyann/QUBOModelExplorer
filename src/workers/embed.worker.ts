/// <reference lib="webworker" />

/**
 * Embedding worker.
 *
 * A search that cannot succeed runs for a few seconds before its work budget
 * gives out, so it runs off the main thread. As with the solver, cancelling
 * means terminating the worker, which is why the hook makes a fresh one per run.
 *
 * Sizes are tried one at a time through `findPegasusEmbedding` itself, carrying
 * the remaining total budget forward. That keeps the core's sizing and budget
 * rules in one place while still letting the page say which fragment it is on.
 */

import { checkEmbedding } from 'qubo-core/hardware/checkEmbedding';
import {
  DEFAULT_EMBED_SEED,
  DEFAULT_PEGASUS_BUDGET,
  PEGASUS_SIZES,
  findPegasusEmbedding,
} from 'qubo-core/hardware/embed';
import type { ProblemGraph } from 'qubo-core/hardware/problemGraph';

export type EmbedRequest = {
  source: ProblemGraph;
  /** One size to try, or every size smallest first. */
  size: number | 'auto';
  seed?: number;
};

export type EmbedResponse =
  | { kind: 'trying'; m: number }
  | {
      kind: 'done';
      m: number;
      chains: number[][];
      /** `checkEmbedding`'s verdict; it shares no code with the search. */
      valid: boolean;
      problems: string[];
      work: number;
    }
  | { kind: 'failed'; m: number; work: number }
  | { kind: 'error'; message: string };

const ctx = self as unknown as DedicatedWorkerGlobalScope;

ctx.onmessage = (ev: MessageEvent<EmbedRequest>) => {
  const { source, size, seed = DEFAULT_EMBED_SEED } = ev.data;
  const post = (m: EmbedResponse) => ctx.postMessage(m);
  try {
    const sizes = size === 'auto' ? PEGASUS_SIZES : [size];
    let work = 0;
    let lastM = sizes[0];
    for (const m of sizes) {
      if (work >= DEFAULT_PEGASUS_BUDGET) break;
      post({ kind: 'trying', m });
      lastM = m;
      const found = findPegasusEmbedding(source, {
        sizes: [m],
        seed,
        totalBudget: DEFAULT_PEGASUS_BUDGET - work,
      });
      work += found.work;
      if (found.result.ok) {
        const verdict = checkEmbedding(source, found.target, found.result.chains);
        post({
          kind: 'done',
          m,
          chains: found.result.chains,
          valid: verdict.ok,
          problems: verdict.problems,
          work,
        });
        return;
      }
    }
    post({ kind: 'failed', m: lastM, work });
  } catch (e) {
    post({ kind: 'error', message: (e as Error).message });
  }
};
