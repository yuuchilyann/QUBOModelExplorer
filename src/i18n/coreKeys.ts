/**
 * Compile-time proof that this app's dictionary still covers the keys
 * `qubo-core` requires.
 *
 * The core cannot import `TKey` — that would make a shared library depend on
 * one consumer's dictionary. So it exports the union of keys it needs and the
 * consumer asserts coverage here. Deleting `sampler.limit.qpu` from `zh.tsx`
 * now fails the build instead of silently rendering a missing key.
 */

import type { SamplerLimitKey } from 'qubo-core/python/samplers';
import type { TKey } from './locales/zh';

type Covers<Needed, Provided> = Needed extends Provided ? true : never;

export const COVERS_SAMPLER_LIMIT_KEYS: Covers<SamplerLimitKey, TKey> = true;
