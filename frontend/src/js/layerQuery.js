// /js/layerQuery.js
import { GEOSERVER_PATH } from './config.js';

const availableLayers = [
  { name: 'Barrio',              workspace: 'Carmen_Apicala', layer: 'barrio' },
  { name: 'División Municipal',  workspace: 'Carmen_Apicala', layer: 'division_municipal' },
  { name: 'División Veredal',    workspace: 'Carmen_Apicala', layer: 'division_veredal' },
];

export function initLayerQueryUI(map) {
  const layerSelect        = document.getElementById('queryLayerSelect');
  const attributeContainer = document.getElementById('attributesContainer');
  const attributeSelect    = document.getElementById('attributeSelect');
  const filterContainer    = document.getElementById('filterContainer');
  const filterInput        = document.getElementById('filterValue');
  const executeBtn         = document.getElementById('executeQuery');
  const resultsDiv         = document.getElementById('queryResults');
  const resultsSelect      = document.getElementById('queryResultsSelect');
  const clearBtn           = document.getElementById('clearQueryResults');

  if (!layerSelect || !attributeSelect || !filterInput || !executeBtn) {
    console.warn('[layerQuery] Faltan elementos en el DOM'); return;
  }

  // ── Cargar lista de capas ──────────────────────────────────
  layerSelect.innerHTML = '<option value="">Seleccione una capa</option>';
  availableLayers.forEach(lyr => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify(lyr);
    opt.textContent = lyr.name;
    layerSelect.appendChild(opt);
  });

  attributeContainer.style.display = 'none';
  filterContainer.style.display    = 'none';
  executeBtn.style.display         = 'none';

  // ── Capa vectorial de resultados ───────────────────────────
  const querySource = new ol.source.Vector();
  const queryLayer  = new ol.layer.Vector({
    source: querySource,
    zIndex: 900,
    style: (feature) => {
      const isSel  = feature.get('selected');
      const color  = isSel ? '#2563eb' : '#ef4444';
      const width  = isSel ? 3 : 2;
      const geom   = feature.getGeometry().getType();
      if (/Point/.test(geom)) {
        return new ol.style.Style({
          image: new ol.style.Circle({
            radius: isSel ? 6 : 5,
            fill:   new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({ color, width }),
          }),
        });
      }
      return new ol.style.Style({
        fill:   new ol.style.Fill({ color: isSel ? 'rgba(37,99,235,0.15)' : 'rgba(239,68,68,0.12)' }),
        stroke: new ol.style.Stroke({ color, width }),
      });
    },
  });
  map.addLayer(queryLayer);

  // ── Cache de valores únicos ────────────────────────────────
  const valuesCache = new Map();

  async function fetchUniqueValues(workspace, layer, attr) {
    const key = `${workspace}:${layer}:${attr}`;
    if (valuesCache.has(key)) return valuesCache.get(key);

    const url = `${GEOSERVER_PATH}/wfs?service=WFS&version=1.1.0`
      + `&request=GetFeature&typeName=${workspace}:${layer}`
      + `&propertyName=${attr}`
      + `&outputFormat=application/json`
      + `&maxFeatures=500`;
    try {
      const rsp  = await fetch(url);
      if (!rsp.ok) throw new Error(`HTTP ${rsp.status}`);
      const json = await rsp.json();
      const vals = new Set(
        (json.features || [])
          .map(f => f.properties?.[attr])
          .filter(v => v !== null && v !== undefined && String(v).trim() !== '')
          .map(v => String(v).trim())
      );
      valuesCache.set(key, vals);
      return vals;
    } catch (e) {
      console.warn('[layerQuery] fetchUniqueValues error:', e.message);
      return new Set();
    }
  }

  // ── Dropdown de sugerencias ────────────────────────────────
  const suggestBox = document.createElement('div');
  suggestBox.style.cssText = `
    position:absolute; left:0; right:0; top:100%;
    z-index:9000; background:#fff;
    border:1.5px solid #2563eb; border-top:none;
    border-radius:0 0 9px 9px;
    max-height:200px; overflow-y:auto;
    box-shadow:0 6px 16px rgba(37,99,235,.15);
    display:none;
  `;
  filterContainer.style.position = 'relative';
  filterContainer.appendChild(suggestBox);

  let allValues    = new Set();
  let suggestOpen  = false;

  function highlight(text, q) {
    if (!q) return escHtml(text);
    const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return escHtml(text).replace(
      new RegExp(`(${safe})`, 'gi'),
      '<strong style="color:#2563eb;font-weight:700">$1</strong>'
    );
  }

  function showSuggestions(q) {
    const term    = q.toLowerCase();
    const matches = term.length === 0
      ? [...allValues].slice(0, 40)
      : [...allValues].filter(v => v.toLowerCase().includes(term)).slice(0, 40);

    if (!matches.length) { hideSuggestions(); return; }

    suggestBox.innerHTML = matches.map(v => `
      <div class="qs-item" style="
        padding:.42rem .75rem; cursor:pointer; font-size:.83rem;
        color:#111827; border-bottom:1px solid #f3f4f6; line-height:1.4;
      " data-val="${escAttr(v)}">${highlight(v, q)}</div>
    `).join('');

    suggestBox.querySelectorAll('.qs-item').forEach(item => {
      item.addEventListener('mouseenter',  () => { clearActive(); item.style.background = '#eff6ff'; });
      item.addEventListener('mouseleave',  () => { item.style.background = ''; });
      item.addEventListener('mousedown',   e  => {
        e.preventDefault();
        filterInput.value = item.dataset.val;
        hideSuggestions();
      });
    });

    suggestBox.style.display = 'block';
    suggestOpen = true;
  }

  function hideSuggestions() {
    suggestBox.style.display = 'none';
    suggestOpen = false;
  }

  function clearActive() {
    suggestBox.querySelectorAll('.qs-item').forEach(i => { i.style.background = ''; i.removeAttribute('data-active'); });
  }

  function getActiveItem() { return suggestBox.querySelector('.qs-item[data-active]'); }

  // ── Eventos del input ──────────────────────────────────────
  filterInput.addEventListener('input',  () => showSuggestions(filterInput.value));
  filterInput.addEventListener('focus',  () => { if (allValues.size) showSuggestions(filterInput.value); });
  filterInput.addEventListener('blur',   () => setTimeout(hideSuggestions, 160));

  filterInput.addEventListener('keydown', e => {
    if (!suggestOpen) return;
    const items = [...suggestBox.querySelectorAll('.qs-item')];
    const cur   = getActiveItem();
    let   idx   = items.indexOf(cur);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      clearActive();
      const next = items[idx + 1] || items[0];
      next.setAttribute('data-active', '1');
      next.style.background = '#eff6ff';
      next.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      clearActive();
      const prev = items[idx - 1] || items[items.length - 1];
      prev.setAttribute('data-active', '1');
      prev.style.background = '#eff6ff';
      prev.scrollIntoView({ block: 'nearest' });
    } else if (e.key === 'Enter' && cur) {
      e.preventDefault();
      filterInput.value = cur.dataset.val;
      hideSuggestions();
    } else if (e.key === 'Escape') {
      hideSuggestions();
    }
  });

  // ── Cambio de CAPA → DescribeFeatureType ──────────────────
  layerSelect.addEventListener('change', async () => {
    attributeSelect.innerHTML = '<option value="">Seleccione un atributo</option>';
    resultsDiv.innerHTML      = '';
    resultsSelect.innerHTML   = '<option value="">Seleccione un resultado</option>';
    querySource.clear();
    filterInput.value         = '';
    filterInput.placeholder   = 'Escribe el valor a buscar';
    allValues                 = new Set();
    hideSuggestions();

    if (!layerSelect.value) {
      attributeContainer.style.display = 'none';
      filterContainer.style.display    = 'none';
      executeBtn.style.display         = 'none';
      return;
    }

    attributeContainer.style.display = 'block';
    filterContainer.style.display    = 'block';
    executeBtn.style.display         = 'inline-block';

    const { workspace, layer } = JSON.parse(layerSelect.value);
    try {
      const url = `${GEOSERVER_PATH}/wfs?service=WFS&version=1.1.0`
        + `&request=DescribeFeatureType&typeName=${workspace}:${layer}`;
      const rsp = await fetch(url);
      const xml = await rsp.text();
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const names = Array.from(doc.getElementsByTagNameNS('*', 'element'))
        .map(el => el.getAttribute('name'))
        .filter(n => n && !n.toLowerCase().includes('geom'));
      names.forEach(name => {
        const o = document.createElement('option');
        o.value = name; o.textContent = name;
        attributeSelect.appendChild(o);
      });
    } catch (err) {
      console.error('[layerQuery] DescribeFeatureType error:', err);
      resultsDiv.textContent = 'Error cargando atributos.';
    }
  });

  // ── Cambio de ATRIBUTO → cargar valores únicos ─────────────
  attributeSelect.addEventListener('change', async () => {
    filterInput.value       = '';
    allValues               = new Set();
    hideSuggestions();

    if (!layerSelect.value || !attributeSelect.value) return;

    const { workspace, layer } = JSON.parse(layerSelect.value);
    const attr = attributeSelect.value;

    filterInput.disabled    = true;
    filterInput.placeholder = 'Cargando sugerencias…';

    allValues = await fetchUniqueValues(workspace, layer, attr);

    filterInput.disabled    = false;
    filterInput.placeholder = allValues.size > 0
      ? `Escribe o elige entre ${allValues.size} valores…`
      : 'Escribe el valor a buscar';
    filterInput.focus();
  });

  // ── EJECUTAR CONSULTA ──────────────────────────────────────
  executeBtn.addEventListener('click', async () => {
    resultsDiv.innerHTML    = '<p style="color:#6b7280;font-size:.83rem">Buscando…</p>';
    resultsSelect.innerHTML = '<option value="">Seleccione un resultado</option>';
    querySource.clear();
    hideSuggestions();

    if (!layerSelect.value || !attributeSelect.value || !filterInput.value.trim()) {
      resultsDiv.innerHTML = '<p style="color:#dc2626;font-size:.83rem">Complete todos los campos.</p>';
      return;
    }

    const { workspace, layer } = JSON.parse(layerSelect.value);
    const attr   = attributeSelect.value.trim();
    const rawVal = filterInput.value.trim();
    const mapCrs = map.getView().getProjection().getCode();

    const escQ  = s => s.replace(/'/g, "''");
    const isNum = s => /^[+-]?\d+(?:[.,]\d+)?$/.test(s);
    const toNum = s => Number(s.replace(',', '.'));

    async function runCQL(cql) {
      const url = `${GEOSERVER_PATH}/wfs?service=WFS&version=1.1.0`
        + `&request=GetFeature&typeName=${workspace}:${layer}`
        + `&outputFormat=application/json`
        + `&srsName=${encodeURIComponent(mapCrs)}`
        + `&CQL_FILTER=${encodeURIComponent(cql)}`;
      try {
        const rsp = await fetch(url);
        if (!rsp.ok) throw new Error(`HTTP ${rsp.status}`);
        const json = await rsp.json();
        return Array.isArray(json.features) ? json.features : [];
      } catch (e) {
        console.error('[layerQuery] GetFeature error:', e);
        return [];
      }
    }

    const attempts = isNum(rawVal)
      ? [
          { cql: `${attr} = ${toNum(rawVal)}` },
          { cql: `${attr} ILIKE '%${escQ(rawVal)}%'` },
        ]
      : [{ cql: `${attr} ILIKE '%${escQ(rawVal)}%'` }];

    let features = [];
    for (const a of attempts) {
      features = await runCQL(a.cql);
      if (features.length) break;
    }

    if (!features.length) {
      resultsDiv.innerHTML = '<p style="color:#6b7280;font-size:.83rem">Sin resultados.</p>';
      return;
    }

    const feats = new ol.format.GeoJSON().readFeatures(
      { type: 'FeatureCollection', features },
      { dataProjection: mapCrs, featureProjection: mapCrs }
    );
    querySource.addFeatures(feats);
    queryLayer.changed();

    resultsDiv.innerHTML = '';
    const container = document.createElement('div');

    feats.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = 'query-result-item';
      const props = { ...f.getProperties() };
      delete props.geometry;
      let html = `<h5 style="color:#2563eb;font-size:.8rem;margin-bottom:.3rem">Resultado #${idx + 1}</h5>`;
      Object.entries(props).forEach(([k, v]) => {
        html += `<div style="font-size:.78rem"><strong>${escHtml(k)}:</strong> ${escHtml(String(v))}</div>`;
      });
      html += `<div style="margin-top:.4rem;display:flex;gap:.35rem">
        <button class="btn btn-sm btn-ghost btn-zoom" data-idx="${idx}">
          <i class="fas fa-search-plus"></i> Zoom
        </button>
        <button class="btn btn-sm btn-ghost btn-del" data-idx="${idx}" style="color:#dc2626">
          <i class="fas fa-trash"></i>
        </button>
      </div>`;
      item.innerHTML = html;
      container.appendChild(item);

      const opt = document.createElement('option');
      opt.value = idx;
      opt.textContent = `Resultado #${idx + 1}`;
      resultsSelect.appendChild(opt);
    });

    resultsDiv.appendChild(container);

    function selectOne(idx) {
      feats.forEach(ft => ft.set('selected', false));
      feats[idx].set('selected', true);
      queryLayer.changed();
      map.getView().fit(feats[idx].getGeometry().getExtent(), {
        duration: 500, maxZoom: 18, padding: [40, 40, 40, 40],
      });
    }

    container.addEventListener('click', e => {
      const z = e.target.closest('.btn-zoom');
      const d = e.target.closest('.btn-del');
      if (z) selectOne(Number(z.dataset.idx));
      if (d) {
        const i = Number(d.dataset.idx);
        querySource.removeFeature(feats[i]);
        feats.splice(i, 1);
        e.target.closest('.query-result-item')?.remove();
      }
    });

    resultsSelect.addEventListener('change', () => {
      const idx = Number(resultsSelect.value);
      if (!isNaN(idx) && feats[idx]) selectOne(idx);
    });
  });

  // ── Limpiar ────────────────────────────────────────────────
  clearBtn.addEventListener('click', () => {
    resultsDiv.innerHTML    = '';
    resultsSelect.innerHTML = '<option value="">Seleccione un resultado</option>';
    filterInput.value       = '';
    querySource.clear();
    hideSuggestions();
  });

  return queryLayer;
}

// ── Helpers ────────────────────────────────────────────────────
function escHtml(s) {
  return String(s ?? '')
    .replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function escAttr(s) {
  return String(s ?? '').replace(/"/g, '&quot;');
}