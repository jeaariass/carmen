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
        // Backend del geovisor
        '/api/gv/carmen': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/gv\/carmen/, '/api'),
        },

        // Intranet
        '/api/intranet': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/intranet/, ''),
        },

        '/api/gv/carmen/static': {
          target: 'http://localhost:3003',
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/gv\/carmen\/static/, ''),
        },

        // GeoServer — aquí está la clave: el navegador pide /geoserver/...
        // Vite lo redirige a http://200.7.107.14:8080/geoserver/...
        // El CORS ya no aplica porque es el servidor de Vite quien pide, no el navegador
        '/geoserver': {
          target: 'http://200.7.107.14:8080',
          changeOrigin: true,
          // No rewrite — /geoserver/... llega tal cual al servidor
        },
      },
    },
  };
});