// frontend/src/auth/guard.js
// Protege las páginas del geovisor.
// Importar en cada página protegida y llamar requireAuth() al inicio.

import { getToken, isTokenAlive, clearSession } from '../utils/token.js';
import { aplicarVisibilidad } from '../utils/permissions.js';
import { getUser, getProject } from '../utils/token.js';

const INTRANET = import.meta.env.VITE_INTRANET_URL;
const BASE     = import.meta.env.BASE_URL || '/CARMEN_DE_APICALA/';

/**
 * Verifica que haya sesión activa y devuelve el payload del token.
 * Si no hay sesión o expiró → redirige a login.
 * @returns {object|null} payload JWT
 */
export function requireAuth() {
  const token = getToken();
  if (!token || !isTokenAlive(token)) {
    logout();
    return null;
  }

  // Aplicar visibilidad de herramientas según rol
  document.addEventListener('DOMContentLoaded', () => {
    aplicarVisibilidad();
    _fillUserUI();
  });

  return getToken();
}

/** Rellena elementos con data-user-* */
function _fillUserUI() {
  const user    = getUser();
  const project = getProject();
  if (!user) return;
  document.querySelectorAll('[data-user-nombre]').forEach(el => { el.textContent = user.nombre; });
  document.querySelectorAll('[data-user-rol]').forEach(el => { el.textContent = user.rol; });
  if (project) {
    document.querySelectorAll('[data-project-nombre]').forEach(el => { el.textContent = project.nombre; });
  }
}

/**
 * Cierra sesión: notifica a la intranet y limpia localStorage.
 */
export async function logout() {
  const token = getToken();
  if (token) {
    try {
      await fetch(`${INTRANET}/api/geoauth/session-end`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        keepalive: true,
      });
    } catch { /* no bloquear si falla */ }
  }
  clearSession();
  window.location.href = `${BASE}login.html`;
}

/** Enlaza todos los botones de logout */
export function bindLogout() {
  document.querySelectorAll('#btnLogout, [data-logout]').forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      if (confirm('¿Cerrar sesión?')) logout();
    });
  });
}
