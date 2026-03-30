// frontend/vite.config.js
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    base: env.VITE_BASE || '/CARMEN_DE_APICALA/',

    build: {
      rollupOptions: {
        input: {
          main:       resolve(__dirname, 'index.html'),
          login:      resolve(__dirname, 'login.html'),
          adminUsers: resolve(__dirname, 'admin-users.html'),
        },
      },
    },

    server: {
      port: 5173,
      strictPort: false,

      proxy: {
        '/gv-carmen-docs': {
          target: 'http://localhost:4003',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/gv-carmen-docs/, ''),
        },
        '/api/gv/carmen': {
          target: 'http://localhost:4003',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/gv\/carmen/, '/api'),
        },
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