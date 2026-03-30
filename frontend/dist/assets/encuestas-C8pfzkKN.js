function V(M){const{root:b,eventBus:U,map:p}=M||{};if(!b){console.error("[encuestas] faltan ctx.root");return}const s=b.querySelector("#surveysRoot");if(!s){console.warn("[encuestas] No existe #surveysRoot en el DOM.");return}const $="cda_surveys_v1",r=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;"),A=()=>{const e=new Date;return e.setMilliseconds(0),e.toISOString()},C=()=>`enc_${Date.now()}_${Math.floor(Math.random()*1e5)}`,c=e=>{var a;return(((a=s.querySelector(e))==null?void 0:a.value)??"").trim()},d=e=>{var a;return((a=s.querySelector(`input[type="radio"][name="${CSS.escape(e)}"]:checked`))==null?void 0:a.value)??""},O=e=>Array.from(s.querySelectorAll(`input[type="checkbox"][name="${CSS.escape(e)}"]:checked`)).map(a=>a.value),x=()=>{try{return JSON.parse(localStorage.getItem($)||"[]")}catch{return[]}},E=e=>localStorage.setItem($,JSON.stringify(e));let v=!1,u=null,f=null,g=null;s.innerHTML=`
    <div class="sv-shell">

      <!-- Barra de progreso de pasos -->
      <div class="sv-stepper">
        <div class="sv-step active" data-step="1">
          <div class="sv-step-icon"><i class="fas fa-map-marker-alt"></i></div>
          <span>Ubicación</span>
        </div>
        <div class="sv-step-line"></div>
        <div class="sv-step" data-step="2">
          <div class="sv-step-icon"><i class="fas fa-users"></i></div>
          <span>Percepción</span>
        </div>
        <div class="sv-step-line"></div>
        <div class="sv-step" data-step="3">
          <div class="sv-step-icon"><i class="fas fa-city"></i></div>
          <span>Diagnóstico</span>
        </div>
        <div class="sv-step-line"></div>
        <div class="sv-step" data-step="4">
          <div class="sv-step-icon"><i class="fas fa-clipboard-list"></i></div>
          <span>Inventario</span>
        </div>
        <div class="sv-step-line"></div>
        <div class="sv-step" data-step="5">
          <div class="sv-step-icon"><i class="fas fa-comment-dots"></i></div>
          <span>Participación</span>
        </div>
        <div class="sv-step-line"></div>
        <div class="sv-step" data-step="6">
          <div class="sv-step-icon"><i class="fas fa-check"></i></div>
          <span>Historial</span>
        </div>
      </div>

      <!-- Meta info -->
      <div class="sv-meta-bar">
        <div class="sv-meta-chip">
          <i class="fas fa-fingerprint"></i>
          <span class="sv-meta-lbl">ID:</span>
          <span id="enc_id" class="sv-meta-val">${r(C())}</span>
        </div>
        <div class="sv-meta-chip">
          <i class="fas fa-clock"></i>
          <span class="sv-meta-lbl">Fecha:</span>
          <span id="enc_ts" class="sv-meta-val">${r(A())}</span>
        </div>
      </div>

      <!-- ═══ PASO 1: UBICACIÓN ═══ -->
      <div class="sv-pane active" data-pane="1">
        <div class="sv-pane-header sv-color-blue">
          <div class="sv-pane-icon"><i class="fas fa-map-marker-alt"></i></div>
          <div>
            <div class="sv-pane-title">Ubicación de la encuesta</div>
            <div class="sv-pane-sub">Capture la ubicación haciendo clic en el mapa (opcional)</div>
          </div>
        </div>
        <div class="sv-pane-body">
          <div class="sv-loc-grid">
            <div class="sv-loc-coord">
              <div class="sv-loc-label"><i class="fas fa-arrows-left-right"></i> Longitud</div>
              <div class="sv-loc-value" id="enc_lon">—</div>
            </div>
            <div class="sv-loc-coord">
              <div class="sv-loc-label"><i class="fas fa-arrows-up-down"></i> Latitud</div>
              <div class="sv-loc-value" id="enc_lat">—</div>
            </div>
          </div>
          <div class="sv-loc-actions">
            <button type="button" class="sv-btn sv-btn-primary" id="btnCaptureOnMap">
              <i class="fas fa-crosshairs"></i> Capturar en mapa
            </button>
            <button type="button" class="sv-btn sv-btn-ghost" id="btnClearCoords">
              <i class="fas fa-eraser"></i> Limpiar
            </button>
          </div>
          <div class="sv-hint" id="locHint">
            <i class="fas fa-circle-info"></i> Active "Capturar en mapa" y haga clic en el mapa para fijar la ubicación.
          </div>
        </div>
        <div class="sv-nav">
          <span></span>
          <button type="button" class="sv-btn sv-btn-primary sv-btn-next" data-go="2">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- ═══ PASO 2: PERCEPCIÓN CIUDADANA ═══ -->
      <div class="sv-pane" data-pane="2">
        <div class="sv-pane-header sv-color-purple">
          <div class="sv-pane-icon"><i class="fas fa-users"></i></div>
          <div>
            <div class="sv-pane-title">Percepción ciudadana</div>
            <div class="sv-pane-sub">Situación general del municipio según el ciudadano</div>
          </div>
        </div>
        <div class="sv-pane-body">

          <div class="sv-field">
            <label class="sv-label">Problemas percibidos <span class="sv-tag">múltiple</span></label>
            <div class="sv-check-grid">
              ${D("pc_problemas",[["seguridad","Seguridad y convivencia"],["movilidad","Movilidad"],["esp_publico","Espacio público"],["ambiente","Ambiente (ruido, residuos, aire)"],["riesgos","Riesgos / desastres"],["servicios","Servicios públicos"],["equipamientos","Equipamientos (salud / educación / deporte)"],["otro","Otro"]])}
            </div>
          </div>

          <div class="sv-field-row">
            <div class="sv-field">
              <label class="sv-label" for="pc_prioridad">Principal prioridad del municipio</label>
              <select id="pc_prioridad" class="sv-select">
                <option value="">Seleccione…</option>
                <option value="seguridad">Seguridad</option>
                <option value="movilidad">Movilidad</option>
                <option value="esp_publico">Espacio público</option>
                <option value="ambiente">Ambiente</option>
                <option value="riesgos">Gestión del riesgo</option>
                <option value="equipamientos">Equipamientos</option>
                <option value="empleo">Empleo / economía</option>
              </select>
            </div>
            <div class="sv-field">
              <label class="sv-label">Sensación de seguridad</label>
              <div class="sv-radio-pills">
                ${h("pc_seguridad",[["alta","Alta"],["media","Media"],["baja","Baja"]])}
              </div>
            </div>
          </div>

          <div class="sv-field">
            <label class="sv-label">Satisfacción general <span class="sv-tag">1 = Muy insatisfecho · 5 = Muy satisfecho</span></label>
            <div class="sv-rating">
              ${h("pc_satisfaccion",[["1","1"],["2","2"],["3","3"],["4","4"],["5","5"]])}
            </div>
          </div>

        </div>
        <div class="sv-nav">
          <button type="button" class="sv-btn sv-btn-ghost sv-btn-prev" data-go="1">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button type="button" class="sv-btn sv-btn-primary sv-btn-next" data-go="3">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- ═══ PASO 3: DIAGNÓSTICOS SECTORIALES ═══ -->
      <div class="sv-pane" data-pane="3">
        <div class="sv-pane-header sv-color-teal">
          <div class="sv-pane-icon"><i class="fas fa-city"></i></div>
          <div>
            <div class="sv-pane-title">Diagnósticos sectoriales</div>
            <div class="sv-pane-sub">Estado percibido de cada sector del municipio</div>
          </div>
        </div>
        <div class="sv-pane-body">
          <div class="sv-sector-grid">
            ${w("Movilidad","ds_movilidad_estado","fa-road")}
            ${w("Ambiente","ds_ambiente_estado","fa-leaf")}
            ${w("Espacio público","ds_espacio_publico_estado","fa-tree-city")}
            ${w("Gestión de riesgos","ds_riesgos_estado","fa-triangle-exclamation")}
          </div>
        </div>
        <div class="sv-nav">
          <button type="button" class="sv-btn sv-btn-ghost sv-btn-prev" data-go="2">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button type="button" class="sv-btn sv-btn-primary sv-btn-next" data-go="4">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- ═══ PASO 4: INVENTARIOS ═══ -->
      <div class="sv-pane" data-pane="4">
        <div class="sv-pane-header sv-color-orange">
          <div class="sv-pane-icon"><i class="fas fa-clipboard-list"></i></div>
          <div>
            <div class="sv-pane-title">Inventarios simples</div>
            <div class="sv-pane-sub">Registre puntos de interés, equipamientos o conflictos detectados</div>
          </div>
        </div>
        <div class="sv-pane-body">
          <div class="sv-field-row">
            <div class="sv-field">
              <label class="sv-label" for="inv_tipo">Tipo de inventario</label>
              <select id="inv_tipo" class="sv-select">
                <option value="">Seleccione…</option>
                <option value="equipamiento">Equipamiento</option>
                <option value="conflicto_uso">Conflicto de uso</option>
                <option value="punto_critico">Punto crítico</option>
              </select>
            </div>
            <div class="sv-field">
              <label class="sv-label" for="inv_nombre">Nombre / referencia</label>
              <input id="inv_nombre" class="sv-input" type="text" placeholder="Ej: Parque central">
            </div>
          </div>
          <div class="sv-field-row">
            <div class="sv-field">
              <label class="sv-label">Estado</label>
              <div class="sv-radio-pills sv-estado">
                ${h("inv_estado",[["bueno","Bueno"],["regular","Regular"],["malo","Malo"]])}
              </div>
            </div>
            <div class="sv-field">
              <label class="sv-label">Urgencia de intervención</label>
              <div class="sv-radio-pills sv-urgencia">
                ${h("inv_urgencia",[["baja","Baja"],["media","Media"],["alta","Alta"]])}
              </div>
            </div>
          </div>
        </div>
        <div class="sv-nav">
          <button type="button" class="sv-btn sv-btn-ghost sv-btn-prev" data-go="3">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button type="button" class="sv-btn sv-btn-primary sv-btn-next" data-go="5">
            Siguiente <i class="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>

      <!-- ═══ PASO 5: PARTICIPACIÓN ═══ -->
      <div class="sv-pane" data-pane="5">
        <div class="sv-pane-header sv-color-green">
          <div class="sv-pane-icon"><i class="fas fa-comment-dots"></i></div>
          <div>
            <div class="sv-pane-title">Participación ciudadana</div>
            <div class="sv-pane-sub">Propuestas, observaciones o alertas del ciudadano</div>
          </div>
        </div>
        <div class="sv-pane-body">
          <div class="sv-field-row">
            <div class="sv-field">
              <label class="sv-label" for="part_tipo">Tipo de aporte</label>
              <select id="part_tipo" class="sv-select">
                <option value="">Seleccione…</option>
                <option value="propuesta">Propuesta</option>
                <option value="observacion">Observación</option>
                <option value="alerta">Alerta</option>
              </select>
            </div>
            <div class="sv-field">
              <label class="sv-label" for="part_contacto">Contacto <span class="sv-tag">opcional</span></label>
              <input id="part_contacto" class="sv-input" type="text" placeholder="Email o teléfono">
            </div>
          </div>

          <div class="sv-field">
            <label class="sv-label" for="part_texto">Aporte / descripción</label>
            <textarea id="part_texto" class="sv-input sv-textarea" rows="4"
              placeholder="Describa su propuesta, observación o alerta…"></textarea>
          </div>

          <div class="sv-field-row">
            <div class="sv-field">
              <label class="sv-label" for="part_capa_ref">Capa de referencia <span class="sv-tag">opcional</span></label>
              <input id="part_capa_ref" class="sv-input" type="text" placeholder="Ej: division_municipal">
            </div>
            <div class="sv-field">
              <label class="sv-label" for="part_obj_ref">ID objeto <span class="sv-tag">opcional</span></label>
              <input id="part_obj_ref" class="sv-input" type="text" placeholder="Ej: 00123">
            </div>
          </div>
        </div>
        <div class="sv-nav">
          <button type="button" class="sv-btn sv-btn-ghost sv-btn-prev" data-go="4">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
          <button type="button" class="sv-btn sv-btn-success" id="btnSaveSurvey">
            <i class="fas fa-save"></i> Guardar encuesta
          </button>
        </div>
      </div>

      <!-- ═══ PASO 6: HISTORIAL ═══ -->
      <div class="sv-pane" data-pane="6">
        <div class="sv-pane-header sv-color-gray">
          <div class="sv-pane-icon"><i class="fas fa-clock-rotate-left"></i></div>
          <div>
            <div class="sv-pane-title">Historial de encuestas</div>
            <div class="sv-pane-sub">Encuestas guardadas localmente en este dispositivo</div>
          </div>
        </div>
        <div class="sv-pane-body">
          <div class="sv-history-toolbar">
            <span class="sv-badge" id="historyCount">0</span> encuestas guardadas
            <button type="button" class="sv-btn sv-btn-ghost sv-btn-sm" id="btnResetSurvey" style="margin-left:auto">
              <i class="fas fa-plus"></i> Nueva encuesta
            </button>
            <button type="button" class="sv-btn sv-btn-danger sv-btn-sm" id="btnClearHistory">
              <i class="fas fa-trash"></i> Borrar todo
            </button>
          </div>
          <div id="historyList" class="sv-history-list"></div>
        </div>
        <div class="sv-nav">
          <button type="button" class="sv-btn sv-btn-ghost sv-btn-prev" data-go="5">
            <i class="fas fa-arrow-left"></i> Anterior
          </button>
        </div>
      </div>

    </div>
  `,B();const m=s.querySelector("#enc_id"),y=s.querySelector("#enc_ts"),_=()=>{s.querySelector("#enc_lon").textContent=u==null?"—":String(u),s.querySelector("#enc_lat").textContent=f==null?"—":String(f)};_();const k=s.querySelector("#btnCaptureOnMap");k.addEventListener("click",()=>N()),s.querySelector("#btnClearCoords").addEventListener("click",()=>{u=null,f=null,_()}),s.querySelector("#btnSaveSurvey").addEventListener("click",()=>{const e=T();if(!H(e))return;console.log("[ENCUESTA] Registro:",e);const i=x();i.unshift(e),E(i),S(),z(!1),alert("Encuesta guardada localmente (Opera). Revise consola y “Encuestas realizadas”.")}),s.querySelector("#btnResetSurvey").addEventListener("click",()=>z(!0)),s.querySelector("#btnClearHistory").addEventListener("click",()=>{confirm("¿Borrar el historial local de encuestas?")&&(E([]),S())}),S();const R=Array.from(s.querySelectorAll(".sv-pane")),j=Array.from(s.querySelectorAll(".sv-step"));function L(e){var i,t;const a=Number(e);R.forEach(o=>o.classList.toggle("active",Number(o.dataset.pane)===a)),j.forEach((o,l)=>{const n=l+1;o.classList.toggle("active",n===a),o.classList.toggle("done",n<a),o.classList.remove("active"),n===a&&o.classList.add("active")}),(t=(i=s.closest("#surveysRoot"))==null?void 0:i.scrollTo)==null||t.call(i,0,0)}s.addEventListener("click",e=>{const a=e.target.closest("[data-go]");a&&L(a.dataset.go)}),j.forEach((e,a)=>{e.addEventListener("click",()=>L(a+1))}),s.addEventListener("change",e=>{var i;const a=e.target;if(a.type==="radio"){const t=a.name;s.querySelectorAll(`.sv-radio-item input[name="${CSS.escape(t)}"]`).forEach(o=>{var l;(l=o.closest(".sv-radio-item"))==null||l.classList.toggle("checked",o.checked)})}a.type==="checkbox"&&((i=a.closest(".sv-check-item"))==null||i.classList.toggle("checked",a.checked))});const q=s.querySelector("#btnSaveSurvey");return q&&(q.onclick,q.addEventListener("click",()=>{setTimeout(()=>{x().length>0&&L(6)},150)})),console.log("[encuestas] listo."),!0;function N(){var i;v=!v,k.classList.toggle("btn-secondary",!v),k.classList.toggle("btn-primary",v),k.innerHTML=v?'<i class="fas fa-xmark"></i> Cancelar captura':'<i class="fas fa-crosshairs"></i> Capturar en mapa';const e=s.querySelector("#locHint");if(!p){e.textContent=v?"No se detectó “map” en el contexto. Verifique la inicialización del visor.":"Active “Capturar en mapa” y haga clic en el mapa para fijar la ubicación.";return}const a=(i=p.getViewport)==null?void 0:i.call(p);a&&(a.style.cursor=v?"crosshair":""),v?(e.textContent="Modo captura activo: haga clic en el mapa para fijar Lon/Lat.",g=p.on("singleclick",t=>{var o,l;try{const n=(l=(o=window.ol)==null?void 0:o.proj)!=null&&l.toLonLat?window.ol.proj.toLonLat(t.coordinate):null;if(!n){alert("No se pudo transformar coordenada. Verifique que OpenLayers (ol) esté disponible.");return}const I=Number(n[0]),P=Number(n[1]);u=Number.isFinite(I)?I.toFixed(6):null,f=Number.isFinite(P)?P.toFixed(6):null,_(),N()}catch(n){console.error("[encuestas] error capturando coordenadas:",n)}})):(e.textContent="Active “Capturar en mapa” y haga clic en el mapa para fijar la ubicación.",g&&p.un&&p.un("singleclick",g.listener||g),g=null)}function z(e){m&&(m.textContent=C()),y&&(y.textContent=A()),u=null,f=null,_(),e&&(s.querySelectorAll('input[type="text"], textarea').forEach(a=>a.value=""),s.querySelectorAll('input[type="radio"]').forEach(a=>a.checked=!1),s.querySelectorAll('input[type="checkbox"]').forEach(a=>a.checked=!1),s.querySelectorAll("select").forEach(a=>a.value=""))}function T(){var e,a;return{enc_id:((e=m==null?void 0:m.textContent)==null?void 0:e.trim())||C(),enc_ts:((a=y==null?void 0:y.textContent)==null?void 0:a.trim())||A(),enc_lon:u,enc_lat:f,pc_problemas:O("pc_problemas"),pc_prioridad:c("#pc_prioridad"),pc_satisfaccion:d("pc_satisfaccion"),pc_seguridad:d("pc_seguridad"),ds_movilidad_estado:d("ds_movilidad_estado"),ds_ambiente_estado:d("ds_ambiente_estado"),ds_espacio_publico_estado:d("ds_espacio_publico_estado"),ds_riesgos_estado:d("ds_riesgos_estado"),inv_tipo:c("#inv_tipo"),inv_nombre:c("#inv_nombre"),inv_estado:d("inv_estado"),inv_urgencia:d("inv_urgencia"),part_tipo:c("#part_tipo"),part_texto:c("#part_texto"),part_capa_ref:c("#part_capa_ref"),part_obj_ref:c("#part_obj_ref"),part_contacto:c("#part_contacto")}}function H(e){var i;return((i=e.pc_problemas)==null?void 0:i.length)>0||!!e.pc_prioridad||!!e.pc_satisfaccion||!!e.pc_seguridad||!!e.ds_movilidad_estado||!!e.ds_ambiente_estado||!!e.ds_espacio_publico_estado||!!e.ds_riesgos_estado||!!e.inv_tipo||!!e.inv_nombre||!!e.inv_estado||!!e.inv_urgencia||!!e.part_tipo||!!e.part_texto?!0:(alert("La encuesta está vacía. Diligencie al menos una sección antes de guardar."),!1)}function S(){const e=s.querySelector("#historyList"),a=s.querySelector("#historyCount"),i=x();if(a&&(a.textContent=String(i.length)),!!e){if(!i.length){e.innerHTML='<div class="hint">No hay encuestas guardadas localmente aún.</div>';return}e.innerHTML=i.slice(0,30).map((t,o)=>{const l=`${r(t.enc_ts||"")} · ${t.enc_lon&&t.enc_lat?`(${r(t.enc_lon)}, ${r(t.enc_lat)})`:"Sin ubicación"}`;return`
        <div class="history-item">
          <div class="history-main">
            <div class="history-id">${r(t.enc_id||"")}</div>
            <div class="history-sub">${l}</div>
          </div>
          <div class="history-actions">
            <button type="button" class="btn btn-secondary btn-sm" data-act="view" data-idx="${o}">
              <i class="fas fa-eye"></i>
            </button>
            <button type="button" class="btn btn-sm" data-act="del" data-idx="${o}">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `}).join(""),e.querySelectorAll("button[data-act]").forEach(t=>{t.addEventListener("click",()=>{const o=t.getAttribute("data-act"),l=Number(t.getAttribute("data-idx")),n=x();if(o==="view"){console.log("[ENCUESTA] Ver registro:",n[l]),alert("Registro enviado a consola (F12 → Console).");return}if(o==="del"){if(!confirm("¿Eliminar esta encuesta del historial local?"))return;n.splice(l,1),E(n),S()}})})}}function w(e,a,i="fa-circle"){return`
      <div class="sv-sector-card">
        <div class="sv-sector-title">
          <i class="fas ${r(i)}"></i>
          ${r(e)}
        </div>
        <div class="sv-radio-pills sv-estado">
          ${h(a,[["bueno","Bueno"],["regular","Regular"],["malo","Malo"],["na","N/A"]])}
        </div>
      </div>
    `}function D(e,a){return a.map(([i,t])=>`
      <label class="sv-check-item">
        <input type="checkbox" name="${r(e)}" value="${r(i)}">
        <span>${r(t)}</span>
      </label>
    `).join("")}function h(e,a){return a.map(([i,t])=>`
      <label class="sv-radio-item" data-val="${r(i)}">
        <input type="radio" name="${r(e)}" value="${r(i)}">
        ${r(t)}
      </label>
    `).join("")}function B(){if(b.getElementById("surveyStylesV3"))return;const e=b.createElement("style");e.id="surveyStylesV3",e.textContent=`
      /* ── Shell ── */
      .sv-shell { font-family:'Segoe UI',Arial,sans-serif; color:#111827; padding:1.25rem; display:flex; flex-direction:column; gap:1.1rem; }

      /* ── Stepper ── */
      .sv-stepper { display:flex; align-items:center; gap:0; padding:.1rem 0; overflow-x:auto; }
      .sv-step { display:flex; flex-direction:column; align-items:center; gap:.3rem; min-width:72px; cursor:pointer; }
      .sv-step-icon {
        width:38px; height:38px; border-radius:50%;
        background:#f3f4f6; border:2px solid #e5e7eb;
        display:flex; align-items:center; justify-content:center;
        font-size:.85rem; color:#9ca3af;
        transition:all .2s;
      }
      .sv-step span { font-size:.68rem; font-weight:600; color:#9ca3af; white-space:nowrap; transition:color .2s; }
      .sv-step.active .sv-step-icon { background:#2563eb; border-color:#2563eb; color:#fff; }
      .sv-step.active span { color:#2563eb; }
      .sv-step.done .sv-step-icon { background:#dcfce7; border-color:#16a34a; color:#16a34a; }
      .sv-step.done span { color:#16a34a; }
      .sv-step-line { flex:1; height:2px; background:#e5e7eb; min-width:12px; }

      /* ── Meta bar ── */
      .sv-meta-bar { display:flex; gap:.65rem; flex-wrap:wrap; }
      .sv-meta-chip {
        display:flex; align-items:center; gap:.4rem;
        background:#f9fafb; border:1px solid #e5e7eb; border-radius:8px;
        padding:.35rem .7rem; font-size:.78rem; color:#6b7280;
      }
      .sv-meta-chip i { color:#2563eb; }
      .sv-meta-lbl { color:#9ca3af; }
      .sv-meta-val { color:#111827; font-weight:700; font-family:monospace; font-size:.77rem; max-width:200px; overflow:hidden; text-overflow:ellipsis; }

      /* ── Panes ── */
      .sv-pane { display:none; flex-direction:column; gap:1rem; }
      .sv-pane.active { display:flex; }

      /* ── Pane header ── */
      .sv-pane-header {
        display:flex; align-items:center; gap:.85rem;
        padding:.85rem 1rem; border-radius:12px;
      }
      .sv-pane-icon {
        width:44px; height:44px; border-radius:10px;
        display:flex; align-items:center; justify-content:center;
        font-size:1.1rem; color:#fff; flex-shrink:0;
      }
      .sv-pane-title { font-weight:800; font-size:.95rem; }
      .sv-pane-sub { font-size:.78rem; opacity:.8; margin-top:.1rem; }

      .sv-color-blue   { background:linear-gradient(135deg,#eff6ff,#dbeafe); color:#1e40af; }
      .sv-color-blue   .sv-pane-icon { background:#2563eb; }
      .sv-color-purple { background:linear-gradient(135deg,#f5f3ff,#ede9fe); color:#5b21b6; }
      .sv-color-purple .sv-pane-icon { background:#7c3aed; }
      .sv-color-teal   { background:linear-gradient(135deg,#f0fdfa,#ccfbf1); color:#065f46; }
      .sv-color-teal   .sv-pane-icon { background:#059669; }
      .sv-color-orange { background:linear-gradient(135deg,#fff7ed,#fed7aa); color:#9a3412; }
      .sv-color-orange .sv-pane-icon { background:#ea580c; }
      .sv-color-green  { background:linear-gradient(135deg,#f0fdf4,#bbf7d0); color:#14532d; }
      .sv-color-green  .sv-pane-icon { background:#16a34a; }
      .sv-color-gray   { background:linear-gradient(135deg,#f9fafb,#f3f4f6); color:#374151; }
      .sv-color-gray   .sv-pane-icon { background:#6b7280; }

      /* ── Pane body ── */
      .sv-pane-body { display:flex; flex-direction:column; gap:.85rem; }

      /* ── Campos ── */
      .sv-field { display:flex; flex-direction:column; gap:.3rem; flex:1; }
      .sv-field-row { display:grid; grid-template-columns:1fr 1fr; gap:.85rem; }
      .sv-label { font-size:.82rem; font-weight:700; color:#374151; display:flex; align-items:center; gap:.4rem; }
      .sv-tag { font-size:.7rem; font-weight:500; color:#9ca3af; background:#f3f4f6; border-radius:4px; padding:.05rem .35rem; }

      .sv-input, .sv-select, .sv-textarea {
        padding:.52rem .75rem; border:1.5px solid #d1d5db; border-radius:9px;
        font-size:.84rem; color:#111827; background:#fff; outline:none;
        transition:border-color .2s, box-shadow .2s;
        font-family:inherit;
      }
      .sv-input:focus, .sv-select:focus, .sv-textarea:focus {
        border-color:#2563eb; box-shadow:0 0 0 3px rgba(37,99,235,.1);
      }
      .sv-textarea { resize:vertical; min-height:90px; }

      /* ── Checkboxes ── */
      .sv-check-grid { display:grid; grid-template-columns:1fr 1fr; gap:.4rem .5rem; }
      .sv-check-item {
        display:flex; align-items:center; gap:.5rem;
        padding:.4rem .6rem; border:1.5px solid #e5e7eb; border-radius:8px;
        cursor:pointer; font-size:.82rem; color:#374151; transition:all .15s;
      }
      .sv-check-item:hover { border-color:#2563eb; background:#eff6ff; }
      .sv-check-item input[type=checkbox] { accent-color:#2563eb; width:15px; height:15px; flex-shrink:0; }
      .sv-check-item.checked { border-color:#2563eb; background:#eff6ff; color:#1d4ed8; font-weight:600; }

      /* ── Radios tipo pill ── */
      .sv-radio-pills { display:flex; flex-wrap:wrap; gap:.4rem; }
      .sv-radio-item {
        display:flex; align-items:center; gap:.4rem;
        padding:.38rem .75rem; border:1.5px solid #e5e7eb; border-radius:20px;
        cursor:pointer; font-size:.82rem; color:#6b7280; transition:all .15s;
        background:#fff;
      }
      .sv-radio-item:hover { border-color:#2563eb; color:#2563eb; }
      .sv-radio-item input[type=radio] { display:none; }
      .sv-radio-item.checked { border-color:#2563eb; background:#2563eb; color:#fff; font-weight:700; }

      /* Pills de estado */
      .sv-estado .sv-radio-item.checked[data-val=bueno]    { background:#16a34a; border-color:#16a34a; }
      .sv-estado .sv-radio-item.checked[data-val=regular]  { background:#d97706; border-color:#d97706; }
      .sv-estado .sv-radio-item.checked[data-val=malo]     { background:#dc2626; border-color:#dc2626; }
      .sv-urgencia .sv-radio-item.checked[data-val=baja]   { background:#059669; border-color:#059669; }
      .sv-urgencia .sv-radio-item.checked[data-val=media]  { background:#d97706; border-color:#d97706; }
      .sv-urgencia .sv-radio-item.checked[data-val=alta]   { background:#dc2626; border-color:#dc2626; }

      /* ── Rating de estrellas numéricas ── */
      .sv-rating { display:flex; gap:.45rem; flex-wrap:wrap; }
      .sv-rating .sv-radio-item {
        width:46px; height:46px; border-radius:10px;
        justify-content:center; font-size:1.1rem; font-weight:800;
        padding:0;
      }
      .sv-rating .sv-radio-item.checked { background:#f59e0b; border-color:#f59e0b; color:#fff; }

      /* ── Sectores ── */
      .sv-sector-grid { display:grid; grid-template-columns:1fr 1fr; gap:.75rem; }
      .sv-sector-card {
        background:#f9fafb; border:1px solid #e5e7eb; border-radius:12px;
        padding:.75rem; display:flex; flex-direction:column; gap:.5rem;
      }
      .sv-sector-title {
        display:flex; align-items:center; gap:.4rem;
        font-weight:700; font-size:.83rem; color:#374151;
      }
      .sv-sector-title i { color:#059669; }

      /* ── Ubicación ── */
      .sv-loc-grid { display:grid; grid-template-columns:1fr 1fr; gap:.65rem; margin-bottom:.75rem; }
      .sv-loc-coord {
        background:#f9fafb; border:1px solid #e5e7eb; border-radius:10px;
        padding:.55rem .75rem; text-align:center;
      }
      .sv-loc-label { font-size:.74rem; color:#6b7280; margin-bottom:.15rem; display:flex; align-items:center; justify-content:center; gap:.3rem; }
      .sv-loc-value { font-size:.95rem; font-weight:700; color:#111827; font-family:monospace; }
      .sv-loc-actions { display:flex; gap:.5rem; flex-wrap:wrap; margin-bottom:.6rem; }
      .sv-hint { font-size:.78rem; color:#6b7280; background:#f0f9ff; border:1px solid #bae6fd; border-radius:8px; padding:.45rem .65rem; display:flex; align-items:flex-start; gap:.4rem; }
      .sv-hint i { color:#0284c7; flex-shrink:0; margin-top:.05rem; }

      /* ── Botones ── */
      .sv-btn {
        display:inline-flex; align-items:center; gap:.4rem;
        padding:.48rem 1rem; border-radius:9px; border:none;
        font-size:.84rem; font-weight:700; cursor:pointer;
        transition:all .15s; white-space:nowrap; font-family:inherit;
      }
      .sv-btn:active { transform:scale(.97); }
      .sv-btn-sm { padding:.35rem .7rem; font-size:.79rem; }
      .sv-btn-primary { background:#2563eb; color:#fff; }
      .sv-btn-primary:hover { background:#1d4ed8; }
      .sv-btn-ghost { background:#f3f4f6; color:#374151; border:1px solid #e5e7eb; }
      .sv-btn-ghost:hover { background:#e5e7eb; }
      .sv-btn-success { background:#16a34a; color:#fff; }
      .sv-btn-success:hover { background:#15803d; }
      .sv-btn-danger { background:#dc2626; color:#fff; }
      .sv-btn-danger:hover { background:#b91c1c; }

      /* ── Nav inferior del pane ── */
      .sv-nav {
        display:flex; justify-content:space-between; align-items:center;
        padding-top:.75rem; border-top:1px solid #f3f4f6;
        margin-top:.25rem;
      }

      /* ── Historial ── */
      .sv-history-toolbar { display:flex; align-items:center; gap:.5rem; font-size:.83rem; color:#6b7280; flex-wrap:wrap; }
      .sv-badge {
        background:#2563eb; color:#fff; border-radius:20px;
        padding:.1rem .55rem; font-size:.78rem; font-weight:700;
      }
      .sv-history-list { display:flex; flex-direction:column; gap:.45rem; margin-top:.5rem; max-height:280px; overflow:auto; }
      .sv-history-item {
        display:flex; justify-content:space-between; align-items:center;
        padding:.55rem .75rem; border:1px solid #e5e7eb; border-radius:10px;
        background:#fff; gap:.75rem;
      }
      .sv-history-id { font-weight:700; color:#111827; font-size:.82rem; font-family:monospace; }
      .sv-history-sub { color:#6b7280; font-size:.76rem; margin-top:.1rem; }
      .sv-history-actions { display:flex; gap:.3rem; flex-shrink:0; }

      @media (max-width:580px){
        .sv-field-row { grid-template-columns:1fr; }
        .sv-check-grid { grid-template-columns:1fr; }
        .sv-sector-grid { grid-template-columns:1fr; }
        .sv-loc-grid { grid-template-columns:1fr 1fr; }
        .sv-stepper { gap:0; }
        .sv-step { min-width:52px; }
        .sv-step span { display:none; }
      }
    `,b.head.appendChild(e)}}export{V as initSurveys};
