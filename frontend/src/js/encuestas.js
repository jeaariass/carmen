// /js/encuestas.js
// Encuestas (UI) con captura de ubicación por clic en mapa + persistencia local (Opera/localStorage).
// Sin campos de "observación" en ninguna sección.
// No guarda en BD aún, pero mantiene identificadores listos para Postgres.

export function initSurveys(ctx) {
  const { root, eventBus, map } = ctx || {};
  if (!root) { console.error('[encuestas] faltan ctx.root'); return; }

  const host = root.querySelector('#surveysRoot');
  if (!host) { console.warn('[encuestas] No existe #surveysRoot en el DOM.'); return; }

  const STORAGE_KEY = 'cda_surveys_v1';

  // ---------- helpers ----------
  const esc = (s) => String(s ?? '')
    .replace(/&/g,'&amp;').replace(/</g,'&lt;')
    .replace(/>/g,'&gt;').replace(/"/g,'&quot;')
    .replace(/'/g,'&#039;');

  const nowISO = () => { const d = new Date(); d.setMilliseconds(0); return d.toISOString(); };
  const genId  = () => `enc_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

  const readValue = (sel) => (host.querySelector(sel)?.value ?? '').trim();
  const readRadio = (name) =>
    host.querySelector(`input[type="radio"][name="${CSS.escape(name)}"]:checked`)?.value ?? '';
  const readChecks = (name) =>
    Array.from(host.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(name)}"]:checked`))
      .map(i => i.value);

  const loadAll = () => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'); }
    catch { return []; }
  };
  const saveAll = (arr) => localStorage.setItem(STORAGE_KEY, JSON.stringify(arr));

  // ---------- estado ----------
  let captureMode = false;
  let encLon = null;
  let encLat = null;
  let mapClickKey = null;

  // ---------- UI ----------
  host.innerHTML = `
    <div class="survey-shell">
      <div class="survey-top">
        <div class="survey-meta">
          <div class="meta-item">
            <span class="meta-label">ID</span>
            <span class="meta-value" id="enc_id">${esc(genId())}</span>
          </div>
          <div class="meta-item">
            <span class="meta-label">Fecha</span>
            <span class="meta-value" id="enc_ts">${esc(nowISO())}</span>
          </div>
        </div>

        <div class="survey-locbox">
          <div class="loc-title">
            <i class="fas fa-location-dot"></i>
            Ubicación (opcional)
          </div>
          <div class="loc-row">
            <div><span class="meta-label">Lon</span> <span class="meta-value" id="enc_lon">—</span></div>
            <div><span class="meta-label">Lat</span> <span class="meta-value" id="enc_lat">—</span></div>
          </div>
          <div class="loc-actions">
            <button type="button" class="btn btn-primary" id="btnCaptureOnMap">
              <i class="fas fa-crosshairs"></i> Capturar en mapa
            </button>
            <button type="button" class="btn btn-secondary" id="btnClearCoords">
              <i class="fas fa-eraser"></i> Limpiar
            </button>
          </div>
          <div class="hint" id="locHint">Active “Capturar en mapa” y haga clic en el mapa para fijar la ubicación.</div>
        </div>
      </div>

      <div class="survey-form card" style="margin:0;">
        <div class="card-header">
          <h4><i class="fas fa-clipboard-check"></i> Formulario de encuesta</h4>
          <span class="badge badge-blue">Sin BD</span>
        </div>
        <div class="card-body">
          ${renderAllSections()}
        </div>

        <div class="survey-actions">
          <button type="button" class="btn btn-primary" id="btnSaveSurvey">
            <i class="fas fa-save"></i> Guardar encuesta
          </button>
          <button type="button" class="btn" id="btnResetSurvey">
            <i class="fas fa-rotate-left"></i> Nueva encuesta
          </button>
          <button type="button" class="btn btn-secondary" id="btnClearHistory">
            <i class="fas fa-trash"></i> Borrar historial
          </button>
        </div>
      </div>

      <div class="survey-history card" style="margin-top:1rem;">
        <div class="card-header">
          <h4><i class="fas fa-clock-rotate-left"></i> Encuestas realizadas (local)</h4>
          <span class="badge" id="historyCount">0</span>
        </div>
        <div class="card-body">
          <div id="historyList" class="history-list"></div>
        </div>
      </div>
    </div>
  `;

  injectLocalStylesOnce();

  // ---------- bindings ----------
  const idEl = host.querySelector('#enc_id');
  const tsEl = host.querySelector('#enc_ts');

  const setLocUI = () => {
    host.querySelector('#enc_lon').textContent = (encLon == null) ? '—' : String(encLon);
    host.querySelector('#enc_lat').textContent = (encLat == null) ? '—' : String(encLat);
  };
  setLocUI();

  const btnCapture = host.querySelector('#btnCaptureOnMap');
  btnCapture.addEventListener('click', () => toggleCaptureMode());

  host.querySelector('#btnClearCoords').addEventListener('click', () => {
    encLon = null; encLat = null; setLocUI();
  });

  host.querySelector('#btnSaveSurvey').addEventListener('click', () => {
    const payload = buildPayload();
    const ok = validateRequired(payload);
    if (!ok) return;

    console.log('[ENCUESTA] Registro:', payload);

    const all = loadAll();
    all.unshift(payload);
    saveAll(all);

    renderHistory();
    resetForNewSurvey(false);
    alert('Encuesta guardada localmente (Opera). Revise consola y “Encuestas realizadas”.');
  });

  host.querySelector('#btnResetSurvey').addEventListener('click', () => resetForNewSurvey(true));

  host.querySelector('#btnClearHistory').addEventListener('click', () => {
    if (!confirm('¿Borrar el historial local de encuestas?')) return;
    saveAll([]);
    renderHistory();
  });

  renderHistory();

  console.log('[encuestas] listo.');
  return true;

  // =========================
  //          LÓGICA
  // =========================

  function toggleCaptureMode() {
    captureMode = !captureMode;

    btnCapture.classList.toggle('btn-secondary', !captureMode);
    btnCapture.classList.toggle('btn-primary', captureMode);
    btnCapture.innerHTML = captureMode
      ? '<i class="fas fa-xmark"></i> Cancelar captura'
      : '<i class="fas fa-crosshairs"></i> Capturar en mapa';

    const hint = host.querySelector('#locHint');

    if (!map) {
      hint.textContent = captureMode
        ? 'No se detectó “map” en el contexto. Verifique la inicialización del visor.'
        : 'Active “Capturar en mapa” y haga clic en el mapa para fijar la ubicación.';
      return;
    }

    const viewport = map.getViewport?.();
    if (viewport) viewport.style.cursor = captureMode ? 'crosshair' : '';

    if (captureMode) {
      hint.textContent = 'Modo captura activo: haga clic en el mapa para fijar Lon/Lat.';
      mapClickKey = map.on('singleclick', (evt) => {
        try {
          const lonLat = (window.ol?.proj?.toLonLat)
            ? window.ol.proj.toLonLat(evt.coordinate)
            : null;

          if (!lonLat) {
            alert('No se pudo transformar coordenada. Verifique que OpenLayers (ol) esté disponible.');
            return;
          }

          const lon = Number(lonLat[0]);
          const lat = Number(lonLat[1]);
          encLon = Number.isFinite(lon) ? lon.toFixed(6) : null;
          encLat = Number.isFinite(lat) ? lat.toFixed(6) : null;
          setLocUI();

          toggleCaptureMode();
        } catch (e) {
          console.error('[encuestas] error capturando coordenadas:', e);
        }
      });
    } else {
      hint.textContent = 'Active “Capturar en mapa” y haga clic en el mapa para fijar la ubicación.';
      if (mapClickKey && map.un) {
        map.un('singleclick', mapClickKey.listener || mapClickKey);
      }
      mapClickKey = null;
    }
  }

  function resetForNewSurvey(clearForm) {
    if (idEl) idEl.textContent = genId();
    if (tsEl) tsEl.textContent = nowISO();
    encLon = null; encLat = null; setLocUI();

    if (clearForm) {
      host.querySelectorAll('input[type="text"], textarea').forEach(i => i.value = '');
      host.querySelectorAll('input[type="radio"]').forEach(i => i.checked = false);
      host.querySelectorAll('input[type="checkbox"]').forEach(i => i.checked = false);
      host.querySelectorAll('select').forEach(s => s.value = '');
    }
  }

  function buildPayload() {
    return {
      enc_id: idEl?.textContent?.trim() || genId(),
      enc_ts: tsEl?.textContent?.trim() || nowISO(),
      enc_lon: encLon,
      enc_lat: encLat,

      // -------- Percepción ciudadana (pc_)
      pc_problemas: readChecks('pc_problemas'),
      pc_prioridad: readValue('#pc_prioridad'),
      pc_satisfaccion: readRadio('pc_satisfaccion'),
      pc_seguridad: readRadio('pc_seguridad'),

      // -------- Diagnósticos sectoriales (ds_) (solo estado, sin observación)
      ds_movilidad_estado: readRadio('ds_movilidad_estado'),
      ds_ambiente_estado: readRadio('ds_ambiente_estado'),
      ds_espacio_publico_estado: readRadio('ds_espacio_publico_estado'),
      ds_riesgos_estado: readRadio('ds_riesgos_estado'),

      // -------- Inventarios simples (inv_) (sin observaciones)
      inv_tipo: readValue('#inv_tipo'),
      inv_nombre: readValue('#inv_nombre'),
      inv_estado: readRadio('inv_estado'),
      inv_urgencia: readRadio('inv_urgencia'),

      // -------- Participación (part_)
      part_tipo: readValue('#part_tipo'),
      part_texto: readValue('#part_texto'),
      part_capa_ref: readValue('#part_capa_ref'),
      part_obj_ref: readValue('#part_obj_ref'),
      part_contacto: readValue('#part_contacto'),
    };
  }

  function validateRequired(p) {
    const hasAny =
      (p.pc_problemas?.length > 0) ||
      !!p.pc_prioridad || !!p.pc_satisfaccion || !!p.pc_seguridad ||
      !!p.ds_movilidad_estado || !!p.ds_ambiente_estado || !!p.ds_espacio_publico_estado || !!p.ds_riesgos_estado ||
      !!p.inv_tipo || !!p.inv_nombre || !!p.inv_estado || !!p.inv_urgencia ||
      !!p.part_tipo || !!p.part_texto;

    if (!hasAny) {
      alert('La encuesta está vacía. Diligencie al menos una sección antes de guardar.');
      return false;
    }
    return true;
  }

  function renderHistory() {
    const list = host.querySelector('#historyList');
    const count = host.querySelector('#historyCount');
    const all = loadAll();
    if (count) count.textContent = String(all.length);

    if (!list) return;
    if (!all.length) {
      list.innerHTML = `<div class="hint">No hay encuestas guardadas localmente aún.</div>`;
      return;
    }

    list.innerHTML = all.slice(0, 30).map((r, idx) => {
      const subtitle = `${esc(r.enc_ts || '')} · ${r.enc_lon && r.enc_lat ? `(${esc(r.enc_lon)}, ${esc(r.enc_lat)})` : 'Sin ubicación'}`;
      return `
        <div class="history-item">
          <div class="history-main">
            <div class="history-id">${esc(r.enc_id || '')}</div>
            <div class="history-sub">${subtitle}</div>
          </div>
          <div class="history-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-act="view" data-idx="${idx}">
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn btn-sm" data-act="del" data-idx="${idx}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `;
    }).join('');

    list.querySelectorAll('button[data-act]').forEach(btn => {
      btn.addEventListener('click', () => {
        const act = btn.getAttribute('data-act');
        const idx = Number(btn.getAttribute('data-idx'));
        const allNow = loadAll();

        if (act === 'view') {
          console.log('[ENCUESTA] Ver registro:', allNow[idx]);
          alert('Registro enviado a consola (F12 → Console).');
          return;
        }
        if (act === 'del') {
          if (!confirm('¿Eliminar esta encuesta del historial local?')) return;
          allNow.splice(idx, 1);
          saveAll(allNow);
          renderHistory();
        }
      });
    });
  }

  // =========================
  //      RENDER SECCIONES
  // =========================

  function renderAllSections() {
    return `
      <div class="survey-section">
        <h5 class="section-title">1) Percepción ciudadana</h5>

        <div class="form-group">
          <label>Problemas percibidos (selección múltiple)</label>
          <div class="check-grid">
            ${mkChecks('pc_problemas', [
              ['seguridad', 'Seguridad y convivencia'],
              ['movilidad', 'Movilidad'],
              ['esp_publico', 'Espacio público'],
              ['ambiente', 'Ambiente (ruido, residuos, aire)'],
              ['riesgos', 'Riesgos / desastres'],
              ['servicios', 'Servicios públicos'],
              ['equipamientos', 'Equipamientos (salud/educación/deporte)'],
              ['otro', 'Otro']
            ])}
          </div>
          <small class="hint">ID: <code>pc_problemas[]</code></small>
        </div>

        <div class="form-group">
          <label for="pc_prioridad">Principal prioridad del municipio</label>
          <select id="pc_prioridad" class="form-select">
            <option value="">Seleccione...</option>
            <option value="seguridad">Seguridad</option>
            <option value="movilidad">Movilidad</option>
            <option value="esp_publico">Espacio público</option>
            <option value="ambiente">Ambiente</option>
            <option value="riesgos">Gestión del riesgo</option>
            <option value="equipamientos">Equipamientos</option>
            <option value="empleo">Empleo / economía</option>
          </select>
          <small class="hint">ID: <code>pc_prioridad</code></small>
        </div>

        <div class="form-group">
          <label>Satisfacción general</label>
          <div class="radio-row">
            ${mkRadios('pc_satisfaccion', [['1','1'],['2','2'],['3','3'],['4','4'],['5','5']])}
          </div>
          <small class="hint">ID: <code>pc_satisfaccion</code></small>
        </div>

        <div class="form-group">
          <label>Sensación de seguridad</label>
          <div class="radio-row">
            ${mkRadios('pc_seguridad', [['alta','Alta'],['media','Media'],['baja','Baja']])}
          </div>
          <small class="hint">ID: <code>pc_seguridad</code></small>
        </div>
      </div>

      <div class="survey-section">
        <h5 class="section-title">2) Diagnósticos sectoriales</h5>

        ${renderSector('Movilidad', 'ds_movilidad_estado')}
        ${renderSector('Ambiente', 'ds_ambiente_estado')}
        ${renderSector('Espacio público', 'ds_espacio_publico_estado')}
        ${renderSector('Riesgos', 'ds_riesgos_estado')}
      </div>

      <div class="survey-section">
        <h5 class="section-title">3) Inventarios simples</h5>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="inv_tipo">Tipo de inventario</label>
            <select id="inv_tipo" class="form-select">
              <option value="">Seleccione...</option>
              <option value="equipamiento">Equipamiento</option>
              <option value="conflicto_uso">Conflicto de uso</option>
              <option value="punto_critico">Punto crítico</option>
            </select>
            <small class="hint">ID: <code>inv_tipo</code></small>
          </div>

          <div class="form-group">
            <label for="inv_nombre">Nombre / referencia</label>
            <input id="inv_nombre" class="form-input" type="text">
            <small class="hint">ID: <code>inv_nombre</code></small>
          </div>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label>Estado</label>
            <div class="radio-row">
              ${mkRadios('inv_estado', [['bueno','Bueno'],['regular','Regular'],['malo','Malo']])}
            </div>
            <small class="hint">ID: <code>inv_estado</code></small>
          </div>

          <div class="form-group">
            <label>Urgencia</label>
            <div class="radio-row">
              ${mkRadios('inv_urgencia', [['baja','Baja'],['media','Media'],['alta','Alta']])}
            </div>
            <small class="hint">ID: <code>inv_urgencia</code></small>
          </div>
        </div>
      </div>

      <div class="survey-section">
        <h5 class="section-title">4) Participación</h5>

        <div class="form-group">
          <label for="part_tipo">Tipo de aporte</label>
          <select id="part_tipo" class="form-select">
            <option value="">Seleccione...</option>
            <option value="propuesta">Propuesta</option>
            <option value="observacion">Observación</option>
            <option value="alerta">Alerta</option>
          </select>
          <small class="hint">ID: <code>part_tipo</code></small>
        </div>

        <div class="form-group">
          <label for="part_texto">Aporte</label>
          <textarea id="part_texto" class="form-input" rows="4"></textarea>
          <small class="hint">ID: <code>part_texto</code></small>
        </div>

        <div class="form-grid-2">
          <div class="form-group">
            <label for="part_capa_ref">Capa de referencia (opcional)</label>
            <input id="part_capa_ref" class="form-input" type="text">
            <small class="hint">ID: <code>part_capa_ref</code></small>
          </div>

          <div class="form-group">
            <label for="part_obj_ref">ID objeto (opcional)</label>
            <input id="part_obj_ref" class="form-input" type="text">
            <small class="hint">ID: <code>part_obj_ref</code></small>
          </div>
        </div>

        <div class="form-group">
          <label for="part_contacto">Contacto (opcional)</label>
          <input id="part_contacto" class="form-input" type="text">
          <small class="hint">ID: <code>part_contacto</code></small>
        </div>
      </div>
    `;
  }

  // Diagnóstico sectorial: solo estado (sin observación)
  function renderSector(label, radioName) {
    return `
      <div class="sector-box">
        <div class="sector-title">${esc(label)}</div>
        <div class="form-group" style="margin:0;">
          <label>Estado</label>
          <div class="radio-row">
            ${mkRadios(radioName, [['bueno','Bueno'],['regular','Regular'],['malo','Malo'],['na','No aplica']])}
          </div>
          <small class="hint">ID: <code>${esc(radioName)}</code></small>
        </div>
      </div>
    `;
  }

  function mkChecks(name, items) {
    return items.map(([val, label]) => `
      <label class="check-item">
        <input type="checkbox" name="${esc(name)}" value="${esc(val)}">
        <span>${esc(label)}</span>
      </label>
    `).join('');
  }

  function mkRadios(name, items) {
    return items.map(([val, label]) => `
      <label class="radio-item">
        <input type="radio" name="${esc(name)}" value="${esc(val)}">
        <span>${esc(label)}</span>
      </label>
    `).join('');
  }

  function injectLocalStylesOnce() {
    if (root.getElementById('surveyStylesV3')) return;
    const st = root.createElement('style');
    st.id = 'surveyStylesV3';
    st.textContent = `
      .survey-shell{display:flex;flex-direction:column;gap:1rem}
      .survey-top{display:grid;grid-template-columns:1fr;gap:.75rem}
      .survey-meta{display:flex;gap:.75rem;flex-wrap:wrap}
      .meta-item{background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;padding:.5rem .65rem;min-width:140px}
      .meta-label{display:block;color:#6b7280;font-size:.75rem}
      .meta-value{display:block;color:#111827;font-weight:700;font-size:.9rem;word-break:break-all}

      .survey-locbox{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:.75rem}
      .loc-title{font-weight:800;color:#111827;margin-bottom:.35rem;display:flex;gap:.4rem;align-items:center}
      .loc-row{display:flex;gap:1rem;flex-wrap:wrap;margin:.25rem 0 .5rem 0}
      .loc-actions{display:flex;gap:.5rem;flex-wrap:wrap}
      .survey-actions{display:flex;gap:.5rem;flex-wrap:wrap;padding:.75rem;border-top:1px solid #e5e7eb}

      .survey-section{border:1px solid #e5e7eb;border-radius:12px;padding:.75rem;margin-bottom:.75rem;background:#fff}
      .section-title{margin:.1rem 0 .6rem 0;font-weight:900}
      .form-grid-2{display:grid;grid-template-columns:1fr 1fr;gap:.75rem}
      .radio-row{display:flex;gap:.75rem;flex-wrap:wrap}
      .check-grid{display:grid;grid-template-columns:1fr 1fr;gap:.4rem .75rem}

      .check-item,.radio-item{display:flex;gap:.5rem;align-items:center;font-size:.92rem;color:#111827}
      .sector-box{background:#f9fafb;border:1px solid #e5e7eb;border-radius:12px;padding:.6rem;margin:.6rem 0}
      .sector-title{font-weight:800;margin-bottom:.35rem}

      .history-list{display:flex;flex-direction:column;gap:.5rem}
      .history-item{display:flex;justify-content:space-between;gap:.75rem;align-items:center;border:1px solid #e5e7eb;border-radius:12px;padding:.6rem;background:#fff}
      .history-id{font-weight:900;color:#111827;font-size:.9rem}
      .history-sub{color:#6b7280;font-size:.8rem}
      .history-actions{display:flex;gap:.35rem}
      .btn-sm{padding:.35rem .55rem;font-size:.85rem}

      @media (max-width: 520px){
        .form-grid-2{grid-template-columns:1fr}
        .check-grid{grid-template-columns:1fr}
      }
    `;
    root.head.appendChild(st);
  }
}
