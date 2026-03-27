// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE || '/CARMEN_DE_APICALA/',

    server: {
      port: 5173,
      strictPort: false,

      proxy: {
        '/api/gv/carmen': {
          target: 'http://localhost:4003',   // ← backend Carmen
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/gv\/carmen/, '/api'),
        },
        '/api/intranet': {
          target: 'http://localhost:4000',   // ← intranet CTGlobal
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/intranet/, ''),
        },
        '/geoserver': {
          target: 'http://200.7.107.14:8080',
          changeOrigin: true,
        },
        '/docs': {
          target: 'http://localhost:4003',   // ← archivos estáticos del backend Carmen
          changeOrigin: true,
        },
      },
    },
  };
});