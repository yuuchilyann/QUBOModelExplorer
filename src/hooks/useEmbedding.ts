import { useEffect, useMemo, useRef, useState } from 'react';

import { problemGraph, type ProblemGraph } from 'qubo-core/hardware/problemGraph';
import type { QuboModel } from 'qubo-core/types';
import type { EmbedRequest, EmbedResponse } from '../workers/embed.worker';

/**
 * Beyond this the panel does not try. The heuristic tops out around K₁₆ on
 * dense graphs (qubo-core docs/EMBEDDING.md); sparse graphs go further, but a
 * Pegasus picture with this many chains is no longer readable anyway.
 */
export const EMBED_MAX_VARS = 48;

/** Wait this long after the last edit before starting a search. */
const DEBOUNCE_MS = 300;

export type EmbedState =
  | { kind: 'idle' }
  | { kind: 'too-large'; n: number }
  | { kind: 'running'; m: number | null }
  | {
      kind: 'done';
      m: number;
      chains: number[][];
      valid: boolean;
      problems: string[];
      work: number;
      /** Which problem graph these chains belong to. */
      key: string;
    }
  | { kind: 'failed'; m: number; work: number }
  | { kind: 'error'; message: string };

export type EmbeddingResult = { source: ProblemGraph; sourceKey: string; state: EmbedState };

/**
 * Embeds the current QUBO onto a Pegasus fragment, re-running when the coupling
 * pattern, the requested size or the seed changes. The panel using it mounts
 * only while its tab is showing, so editing elsewhere never pays for a search
 * nobody is looking at.
 */
export function useEmbedding(
  model: QuboModel,
  { size, seed }: { size: number | 'auto'; seed: number },
): EmbeddingResult {
  // Keyed on the coupling pattern, not on Q's identity: dragging P re-derives Q
  // but usually leaves the graph unchanged, and then nothing needs to re-run.
  const source = useMemo(() => problemGraph(model.Q), [model]);
  const sourceKey = useMemo(() => `${source.n}|${source.edges.join(';')}`, [source]);

  const [state, setState] = useState<EmbedState>({ kind: 'idle' });
  const workerRef = useRef<Worker | null>(null);
  const sourceRef = useRef(source);
  sourceRef.current = source;

  useEffect(() => {
    const n = sourceRef.current.n;
    const key = sourceKey;
    if (n > EMBED_MAX_VARS) {
      setState({ kind: 'too-large', n });
      return;
    }

    setState({ kind: 'running', m: null });
    const timer = window.setTimeout(() => {
      const worker = new Worker(new URL('../workers/embed.worker.ts', import.meta.url), {
        type: 'module',
      });
      workerRef.current = worker;
      worker.onmessage = (ev: MessageEvent<EmbedResponse>) => {
        const msg = ev.data;
        if (msg.kind === 'trying') {
          setState({ kind: 'running', m: msg.m });
          return;
        }
        setState(msg.kind === 'done' ? { ...msg, key } : msg);
        worker.terminate();
        if (workerRef.current === worker) workerRef.current = null;
      };
      const req: EmbedRequest = { source: sourceRef.current, size, seed };
      worker.postMessage(req);
    }, DEBOUNCE_MS);

    return () => {
      window.clearTimeout(timer);
      workerRef.current?.terminate();
      workerRef.current = null;
    };
  }, [sourceKey, size, seed]);

  return { source, sourceKey, state };
}
