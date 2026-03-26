// frontend/src/utils/permissions.js
// Sistema de permisos por rol del geovisor CTGlobal
// Roles: VIEWER | EDITOR  (definidos en project_users de la intranet)

import { decodeToken } from './token.js';

export const ROLES = {
  VIEWER: 'VIEWER',
  EDITOR: 'EDITOR',
};

// ── Tabla de permisos ─────────────────────────────────────────
const PERMISOS = {
  VIEWER: [
    'verCapas',
    'buscarPredio',
    'medirDistancia',
    'medirArea',
    'descargarPDF',
    'verTablaAtributos',
    'imprimirMapa',
    'identificarFeature',
    'capturaCoords',
    'verStreet360',
  ],
  EDITOR: [
    'verCapas',
    'buscarPredio',
    'medirDistancia',
    'medirArea',
    'descargarPDF',
    'verTablaAtributos',
    'imprimirMapa',
    'identificarFeature',
    'capturaCoords',
    'verStreet360',
    'editarAtributos',
    'subirArchivos',
    'verAdminPanel',   // admin-users.html
  ],
};

/** Retorna el rol del usuario autenticado */
export function getRol() {
  const payload = decodeToken();
  return payload?.rol || ROLES.VIEWER;
}

/** ¿El usuario actual puede usar esta herramienta? */
export function puedeUsar(herramienta) {
  const rol   = getRol();
  const perms = PERMISOS[rol] || PERMISOS.VIEWER;
  return perms.includes(herramienta);
}

/**
 * Oculta todos los elementos con data-permiso si el usuario no tiene el permiso.
 * Llamar una vez tras cargar el DOM.
 */
export function aplicarVisibilidad() {
  document.querySelectorAll('[data-permiso]').forEach(el => {
    if (!puedeUsar(el.dataset.permiso)) {
      el.style.display = 'none';
      el.setAttribute('aria-hidden', 'true');
    }
  });
}
