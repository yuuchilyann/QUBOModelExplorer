import { useCallback, useEffect, useState } from 'react';

export type Route =
  | { kind: 'overview' }
  | { kind: 'hello' }
  | { kind: 'group'; group: string }
  | { kind: 'case'; id: string }
  | { kind: 'appendix' };

/**
 * Hash routing.
 *
 * Deliberately hash-based rather than history-based: the build uses a relative
 * base so it can be dropped under any subpath, and a hash route keeps deep
 * links (`#/case/graph-coloring`) working there without needing a 404 fallback
 * on the host. Handing a presenter a link straight to one case matters more
 * than pretty URLs.
 */
export function parseHash(hash: string): Route {
  const clean = hash.replace(/^#\/?/, '');
  const [head, tail] = clean.split('/');
  if (head === 'case' && tail) return { kind: 'case', id: tail };
  if (head === 'group' && tail) return { kind: 'group', group: tail };
  if (head === 'hello-world') return { kind: 'hello' };
  if (head === 'appendix') return { kind: 'appendix' };
  return { kind: 'overview' };
}

export function routeToHash(route: Route): string {
  switch (route.kind) {
    case 'overview':
      return '#/overview';
    case 'hello':
      return '#/hello-world';
    case 'group':
      return `#/group/${route.group}`;
    case 'case':
      return `#/case/${route.id}`;
    case 'appendix':
      return '#/appendix';
  }
}

export function useHashRoute(): [Route, (r: Route) => void] {
  const [route, setRoute] = useState<Route>(() => parseHash(window.location.hash));

  useEffect(() => {
    const onChange = () => setRoute(parseHash(window.location.hash));
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = useCallback((r: Route) => {
    window.location.hash = routeToHash(r);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  return [route, navigate];
}

/** Identifier used for the linear prev/next walk. */
export function routeKey(route: Route): string {
  switch (route.kind) {
    case 'overview':
      return 'overview';
    case 'hello':
      return 'hello-world';
    case 'appendix':
      return 'appendix';
    case 'group':
      return `group:${route.group}`;
    case 'case':
      return route.id;
  }
}

export function keyToRoute(key: string): Route {
  if (key === 'overview') return { kind: 'overview' };
  if (key === 'hello-world') return { kind: 'hello' };
  if (key === 'appendix') return { kind: 'appendix' };
  if (key.startsWith('group:')) return { kind: 'group', group: key.slice(6) };
  return { kind: 'case', id: key };
}
