import type { ReactNode } from 'react';

/** Internal language codes. Add future languages here. */
export type Lang = 'zh-Hant' | 'en';

/** Parameters passed to an interpolating translation entry. */
export type TParams = Record<string, unknown>;

/**
 * A translation entry. Either a static ReactNode (a plain label, or rich JSX
 * that takes no parameters), or a function of params returning either.
 * `ReactNode` excludes functions, so a `typeof v === 'function'` check cleanly
 * distinguishes the two.
 */
export type TValue = ReactNode | ((p: TParams) => ReactNode);
