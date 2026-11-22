import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Dev only: the API is proxied through the dev server so requests are same-origin, like in production.
// Cross-origin requests with an Authorization header need a CORS preflight per request,
// and the API's nginx rate limit rejects bursts of those with 503.
export const DEV_API_PROXY = '/mdb-api-proxy';

// The app is served under /admin/ in every environment (was `homepage` in CRA).
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'REACT_APP_');

  return {
    base     : '/admin/',
    plugins  : [react(), tailwindcss()],
    // Keep the existing REACT_APP_* variable names (Dockerfile, CI, .env.* files).
    envPrefix: 'REACT_APP_',
    server   : {
      port : 3000,
      open : '/admin/',
      proxy: env.REACT_APP_MDB_URL
        ? {
          [DEV_API_PROXY]: {
            target      : env.REACT_APP_MDB_URL,
            changeOrigin: true,
            rewrite     : path => path.slice(DEV_API_PROXY.length),
          },
        }
        : undefined,
    },
    build: {
      outDir   : 'build',
      sourcemap: true,
      // Do not inline ~500 flag SVGs from flag-icons into the CSS bundle; load them on demand.
      assetsInlineLimit: file => (file.includes('flag-icons') ? false : undefined),
    },
  };
});
