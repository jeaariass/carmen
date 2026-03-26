// /js/layerQuery.js
import { GEOSERVER_PATH } from './config.js';

// Lista de capas disponibles (ajusta a tu workspace)
const availableLayers = [
  // EJEMPLO: cambia Manizales -> Dos_quebradas y capas reales
  { name: 'Barrio', workspace: 'Carmen_Apicala', layer: 'barrio' },
  { name: 'División Municipal', workspace: 'Carmen_Apicala', layer: 'division_municipal' },
  { name: 'División Veredal', workspace: 'Carmen_Apicala', layer: 'division_veredal' },
  // { name: 'Predios', workspace: 'Dos_quebradas', layer: 'predios_2024' },
];

export function initLayerQueryUI(map) {
  // DOM
  const layerSelect        = document.getElementById('queryLayerSelect');
  const attributeContainer = document.getElementById('attributesContainer');
  const attributeSelect    = document.getElementById('attributeSelect');
  const filterContainer    = document.getElementById('filterContainer');
  const filterInput        = document.getElementById('filterValue');
  const executeBtn         = document.getElementById('executeQuery');
  const resultsDiv         = document.getElementById('queryResults');
  const resultsSelect      = document.getElementById('queryResultsSelect');
  const clearBtn           = document.getElementById('clearQueryResults');

  // 1) Cargar capas
  layerSelect.innerHTML = '<option value="">Seleccione una capa</option>';
  availableLayers.forEach(lyr => {
    const opt = document.createElement('option');
    opt.value = JSON.stringify(lyr);
    opt.textContent = lyr.name;
    layerSelect.appendChild(opt);
  });

  // 2) Ocultar secundarios
  attributeContainer.style.display = 'none';
  filterContainer.style.display    = 'none';
  executeBtn.style.display         = 'none';
  resultsSelect.innerHTML          = '<option value="">Seleccione un resultado</option>';

  // 3) Capa vectorial de resultados
  const querySource = new ol.source.Vector();
  const queryLayer  = new ol.layer.Vector({
    source: querySource,
    zIndex: 900,
    style: (feature) => {
      const geom = feature.getGeometry().getType();
      const isSel = feature.get('selected');
      const color = isSel ? '#2563eb' : '#ef4444';
      const width = isSel ? 3 : 2;
      if (/Point/.test(geom)) {
        return new ol.style.Style({
          image: new ol.style.Circle({
            radius: isSel ? 6 : 5,
            fill: new ol.style.Fill({ color }),
            stroke: new ol.style.Stroke({ color, width })
          })
        });
      }
      return new ol.style.Style({ 
        fill: new ol.style.Fill({ color: isSel ? 'rgba(37,99,235,0.15)' : 'rgba(239,68,68,0.12)' }),
        stroke: new ol.style.Stroke({ color, width }) 
      });
    }
  });
  map.addLayer(queryLayer);

  // 4) Al cambiar capa → DescribeFeatureType
  layerSelect.addEventListener('change', async () => {
    attributeSelect.innerHTML = '<option value="">Seleccione un atributo</option>';
    resultsDiv.innerHTML      = '';
    resultsSelect.innerHTML   = '<option value="">Seleccione un resultado</option>';
    querySource.clear();

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
      const url = `${GEOSERVER_PATH}/wfs?service=WFS&version=1.1.0&request=DescribeFeatureType&typeName=${workspace}:${layer}`;
      const rsp = await fetch(url);
      const xml = await rsp.text();
      const doc = new DOMParser().parseFromString(xml, 'application/xml');
      const names = Array.from(doc.getElementsByTagNameNS('*','element'))
                         .map(el => el.getAttribute('name'))
                         .filter(n => n && !n.toLowerCase().includes('geom'));
      names.forEach(name => {
        const o = document.createElement('option');
        o.value = name; o.textContent = name; attributeSelect.appendChild(o);
      });
    } catch (err) {
      console.error('DescribeFeatureType error:', err);
      resultsDiv.textContent = 'Error cargando atributos.';
    }
  });

  // 5) Ejecutar consulta (WFS GetFeature + CQL_FILTER) con intento numérico y fallback a texto
  executeBtn.addEventListener('click', async () => {
    resultsDiv.innerHTML    = '<h4>Cargando resultados...</h4>';
    resultsSelect.innerHTML = '<option value="">Seleccione un resultado</option>';
    querySource.clear();

    if (!layerSelect.value || !attributeSelect.value || !filterInput.value.trim()) {
      resultsDiv.textContent = 'Complete todos los campos.';
      return;
    }

    const { workspace, layer } = JSON.parse(layerSelect.value);
    const attr   = attributeSelect.value.trim();
    const rawVal = filterInput.value.trim();

    // CRS del mapa: pedimos el WFS en el mismo
    const mapCrs = map.getView().getProjection().getCode();

    // Utilidades
    const escapeQuotes = (s) => s.replace(/'/g, "''");
    const isNumericLike = (s) => {
      // considera numerico si es solo dígitos (opcional +/-, puntos o comas decimal)
      // sin separadores tipo guiones o letras
      return /^[+-]?\d+(?:[.,]\d+)?$/.test(s);
    };
    const normalizeNumeric = (s) => Number(String(s).replace(',', '.')); // 12,34 -> 12.34

    async function runCQL(cql) {
      const url  = `${GEOSERVER_PATH}/wfs?service=WFS&version=1.1.0`
                + `&request=GetFeature&typeName=${workspace}:${layer}`
                + `&outputFormat=application/json`
                + `&srsName=${encodeURIComponent(mapCrs)}`
                + `&CQL_FILTER=${encodeURIComponent(cql)}`;

      try {
        const rsp  = await fetch(url);
        if (!rsp.ok) throw new Error(`HTTP ${rsp.status}`);
        const json = await rsp.json();
        return json && Array.isArray(json.features) ? json.features : [];
      } catch (err) {
        console.error('[LayerQuery] GetFeature error:', err);
        return [];
      }
    }

    // 1) Construir intentos
    const attempts = [];
    if (isNumericLike(rawVal)) {
      // Intento 1: numérico exacto
      const num = normalizeNumeric(rawVal);
      attempts.push({ label: 'num', cql: `${attr} = ${num}` });
      // Intento 2: texto (fallback)
      attempts.push({ label: 'text', cql: `${attr} ILIKE '%${escapeQuotes(rawVal)}%'` });
    } else {
      // Solo texto
      attempts.push({ label: 'text', cql: `${attr} ILIKE '%${escapeQuotes(rawVal)}%'` });
    }

    // 2) Ejecutar intentos en orden hasta obtener resultados
    let features = [];
    let usedCql  = '';
    for (const at of attempts) {
      const feats = await runCQL(at.cql);
      if (feats.length > 0) {
        features = feats;
        usedCql  = at.cql;
        break;
      }
    }

    if (!features.length) {
      resultsDiv.innerHTML = '<p>No se encontraron resultados.</p>';
      return;
    }

    // 3) Leer features ya en CRS del mapa
    const feats = new ol.format.GeoJSON().readFeatures({
      type: 'FeatureCollection',
      features
    }, {
      dataProjection: mapCrs,
      featureProjection: mapCrs
    });

    querySource.addFeatures(feats);
    queryLayer.changed();

    // 4) Render resultados + Select + acciones
    resultsDiv.innerHTML = '';
    const container = document.createElement('div');
    container.className = 'query-results-list';

    feats.forEach((f, idx) => {
      const item = document.createElement('div');
      item.className = 'query-result-item';
      const props = { ...f.getProperties() }; delete props.geometry;
      let html = `<h5>Resultado #${idx+1}</h5>`;
      Object.entries(props).forEach(([k,v]) => { html += `<div><strong>${k}:</strong> ${v}</div>`; });
      html += ` <div style="margin-top:.35rem;">
                  <button class="btn btn-sm btn-secondary btn-zoom" data-idx="${idx}">Zoom</button>
                  <button class="btn btn-sm btn-secondary btn-del"  data-idx="${idx}">🗑</button>
                </div>`;
      item.innerHTML = html;
      container.appendChild(item);

      const opt = document.createElement('option');
      opt.value = idx; opt.textContent = `#${idx+1}`; resultsSelect.appendChild(opt);
    });

    resultsDiv.appendChild(container);

    function selectOne(idx) {
      feats.forEach(ft => ft.set('selected', false));
      const f = feats[idx];
      f.set('selected', true);
      queryLayer.changed();
      map.getView().fit(f.getGeometry().getExtent(), { duration: 500, maxZoom: 18, padding: [30,30,30,30] });
    }

    container.addEventListener('click', (e) => {
      const z = e.target.closest('.btn-zoom');
      const d = e.target.closest('.btn-del');
      if (z) selectOne(Number(z.dataset.idx));
      if (d) {
        const i = Number(d.dataset.idx);
        querySource.removeFeature(feats[i]);
        feats.splice(i,1);
        e.target.closest('.query-result-item')?.remove();
      }
    });

    resultsSelect.addEventListener('change', () => {
      const idx = Number(resultsSelect.value);
      if (!isNaN(idx)) selectOne(idx);
    });

    console.debug('[LayerQuery] CQL usado:', usedCql || attempts[0]?.cql);
  });

  clearBtn.addEventListener('click', () => {
    resultsDiv.innerHTML = '';
    resultsSelect.innerHTML = '<option value="">Seleccione un resultado</option>';
    querySource.clear();
  });

  return queryLayer;
}
