import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Use relative base ('./') for builds so the bundle works under ANY subpath
// (or domain root) without recompiling — including GitHub Pages project
// subpaths, regardless of repo name. Dev server stays at '/'.
//
// Routing is hash-based (`#/case/max-cut`) precisely so that deep links keep
// working under a relative base without a 404 fallback hack.
export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react()],
  build: {
    outDir: 'publish',
    emptyOutDir: true,
    // The built output is committed so GitHub Pages can serve it directly, and
    // every build produces freshly hashed filenames. A ~4 MB source map would
    // therefore be added to git history on each rebuild and never removed, so
    // it is not generated. The dev server still has full source maps.
    sourcemap: false,
  },
  server: {
    port: 5174,
    open: true,
  },
}));
