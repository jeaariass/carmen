// frontend/src/js/main.js
import { requireAuth, bindLogout }       from '../auth/guard.js';
import { puedeUsar, aplicarVisibilidad } from '../utils/permissions.js';
import { intranetApi }                   from '../services/api.js';
import { getUser }                       from '../utils/token.js';

const token = requireAuth();
if (!token) throw new Error('No autenticado');

window.addEventListener('beforeunload', () => intranetApi.sessionEnd());

class EventBus {
  constructor() { this._l = {}; }
  on(e, fn)  { (this._l[e] ??= []).push(fn); }
  emit(e, d) { (this._l[e] || []).forEach(fn => fn(d)); }
}

async function bootstrap() {
  aplicarVisibilidad();
  bindLogout();

  // Inicial del nombre en el avatar
  const user = getUser();
  if (user?.nombre) {
    const el = document.getElementById('userInitials');
    if (el) el.textContent = user.nombre.charAt(0).toUpperCase();
  }

  const mapEl = document.getElementById('map');
  const ctx   = { eventBus: new EventBus(), mapEl, root: document };

  // Mapa base + capas
  const { initMap }    = await import(/* @vite-ignore */ './map.js');
  await initMap(ctx);
  const { initLayers } = await import(/* @vite-ignore */ './layers.js');
  await initLayers(ctx);

  // Herramientas condicionales por permiso
  async function tryInit(permiso, file, fn, ...args) {
    if (!puedeUsar(permiso)) return;
    try {
      const mod = await import(/* @vite-ignore */ `./${file}`);
      await mod[fn](...args);
    } catch (e) {
      console.warn(`[GeoVisor] ${file}: ${e.message}`);
    }
  }

  await tryInit('identificarFeature', 'identify.js',    'initIdentify',         ctx);
  await tryInit('medirArea',          'measure.js',     'initMeasure',          ctx);
  await tryInit('verTablaAtributos',  'layerQuery.js',  'initLayerQueryUI',     ctx.map);
  await tryInit('imprimirMapa',       'print.js',       'initPrint',            ctx);
  await tryInit('subirArchivos',      'upload.js',      'initUploadModule',     ctx);
  await tryInit('capturaCoords',      'coordpicker.js', 'initCoordinatePicker', ctx);
 

  // Repositorio documental (todos los roles)
  try {
    const { initDocRepo }    = await import(/* @vite-ignore */ './docRepo.js');
    const { initDocUpload }  = await import(/* @vite-ignore */ './docUpload.js');
    initDocRepo(ctx);
    initDocUpload(ctx);
  } catch (e) {
    console.warn('[GeoVisor] docRepo/docUpload:', e.message);
  }
  // Encuestas ciudadanas
  try {
    const { initSurveys } = await import(/* @vite-ignore */ './encuestas.js');
    initSurveys(ctx);
  } catch (e) {
    console.warn('[GeoVisor] encuestas:', e.message);
  }

  console.log('[GeoVisor] Listo ✓ — Carmen de Apicalá');
}

bootstrap().catch(err => console.error('[GeoVisor] Error:', err));
