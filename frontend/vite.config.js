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
        '/gv-carmen-docs': {
          target: 'http://localhost:4003',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/gv-carmen-docs/, ''),
        },

        // API del geovisor
        '/api/gv/carmen': {
          target: 'http://localhost:4003',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/gv\/carmen/, '/api'),
        },

        // Intranet CTGlobal
        '/api/intranet': {
          target: 'http://localhost:4000',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/intranet/, ''),
        },
        '/geoserver': {
          target: 'http://200.7.107.14:8080',
          changeOrigin: true,
        },
        
        
      },
    },
  };
});