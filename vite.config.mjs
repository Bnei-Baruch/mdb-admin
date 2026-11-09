import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// The app is served under /admin/ in every environment (was `homepage` in CRA).
export default defineConfig({
  base     : '/admin/',
  plugins  : [react(), tailwindcss()],
  // Keep the existing REACT_APP_* variable names (Dockerfile, CI, .env.* files).
  envPrefix: 'REACT_APP_',
  server   : {
    port: 3000,
    open: '/admin/',
  },
  build: {
    outDir   : 'build',
    sourcemap: true,
    // Do not inline ~500 flag SVGs from flag-icons into the CSS bundle; load them on demand.
    assetsInlineLimit: file => (file.includes('flag-icons') ? false : undefined),
    // lightningcss (Vite 8 default) fails on invalid selectors in semantic.min.css.
    // TODO: switch back to default after Semantic UI removal (docs/tasks/semantic-to-tailwind.md).
    cssMinify: 'esbuild',
  },
});
