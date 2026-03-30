function P(e){const{root:i,map:a}=e||{};if(!i){console.error("[print] faltan ctx.root");return}const r=i.querySelector("#printRoot");if(!r){console.warn("[print] No existe #printRoot en el DOM.");return}r.innerHTML=`
    <div class="print-shell">
      <div class="form-group">
        <label for="printTitle">Título</label>
        <input id="printTitle" class="form-input" type="text"
               value="GeoVisor Carmen de Apicalá - Vista actual">
      </div>

      <div class="form-group">
        <label for="printNote">Nota (opcional)</label>
        <input id="printNote" class="form-input" type="text"
               placeholder="Ej.: Insumo de consulta. No constituye documento oficial.">
      </div>

      <div style="display:flex; gap:.5rem; flex-wrap:wrap;">
        <button id="btnPrintPreview" class="btn btn-primary">
          <i class="fas fa-print"></i> Previsualizar e imprimir
        </button>
        <button id="btnPrintHelp" class="btn btn-secondary">
          <i class="fas fa-circle-info"></i> Ayuda
        </button>
      </div>

      <div class="hint" style="margin-top:.6rem;">
        Este modo no abre ventanas emergentes. Genera una hoja imprimible y usa el diálogo del navegador.
      </div>
    </div>
  `,S(i);const t=r.querySelector("#btnPrintPreview");return r.querySelector("#btnPrintHelp").addEventListener("click",()=>{alert(`Impresión (sin popups):
1) Clic en “Previsualizar e imprimir”.
2) Se verá una previsualización.
3) Clic en “Imprimir / Guardar PDF” o Ctrl+P.

Si el mapa sale vacío en la previsualización, revise consola (F12).`)}),t.addEventListener("click",async()=>{var l,o,p,v,m,n;if(!a){alert("No se detectó el mapa en el contexto. Verifique la inicialización de OpenLayers.");return}t.disabled=!0,t.innerHTML='<i class="fas fa-spinner fa-spin"></i> Generando...';try{await y(a);const c=x(a);if(!c){alert("No fue posible capturar el mapa. Revise consola (F12).");return}const h=(((l=r.querySelector("#printTitle"))==null?void 0:l.value)||"").trim()||"Vista actual",g=(((o=r.querySelector("#printNote"))==null?void 0:o.value)||"").trim(),b=((v=(p=i.querySelector("#coordScale"))==null?void 0:p.textContent)==null?void 0:v.trim())||((n=(m=i.querySelector("#scaleValue"))==null?void 0:m.textContent)==null?void 0:n.trim())||"",d=new Date;d.setMilliseconds(0);const f=d.toISOString();w(i,{title:h,note:g,iso:f,scaleText:b,dataUrl:c})}catch(c){console.error("[print] error:",c),alert("Ocurrió un error generando la impresión. Revise consola (F12).")}finally{t.disabled=!1,t.innerHTML='<i class="fas fa-print"></i> Previsualizar e imprimir'}}),console.log("[print] listo."),!0}function y(e){return new Promise(i=>{var t;let a=!1;const r=()=>{a||(a=!0,i())};try{(t=e.renderSync)==null||t.call(e)}catch{}e.once("rendercomplete",r),setTimeout(r,900)})}function x(e){var l,o;const i=(l=e.getViewport)==null?void 0:l.call(e);if(!i)return console.error("[print] map.getViewport() no disponible."),null;const a=i.querySelectorAll("canvas");if(!a||!a.length)return console.error("[print] no se encontraron canvas en el viewport."),null;const r=(o=e.getSize)==null?void 0:o.call(e);if(!r)return console.error("[print] map.getSize() no disponible."),null;const t=document.createElement("canvas");t.width=r[0],t.height=r[1];const s=t.getContext("2d");s.fillStyle="#ffffff",s.fillRect(0,0,t.width,t.height),a.forEach(p=>{if(p.width===0||p.height===0)return;const v=Number(p.style.opacity||1);s.globalAlpha=Number.isFinite(v)?v:1;const m=p.style.transform;if(m&&m.startsWith("matrix(")){const n=m.replace("matrix(","").replace(")","").split(",").map(c=>Number(c.trim()));n.length===6&&n.every(Number.isFinite)?s.setTransform(n[0],n[1],n[2],n[3],n[4],n[5]):s.setTransform(1,0,0,1,0,0)}else s.setTransform(1,0,0,1,0,0);try{s.drawImage(p,0,0)}catch(n){console.warn("[print] drawImage falló:",n)}}),s.setTransform(1,0,0,1,0,0),s.globalAlpha=1;try{return t.toDataURL("image/png")}catch(p){return console.error("[print] toDataURL falló:",p),null}}function w(e,{title:i,note:a,iso:r,scaleText:t,dataUrl:s}){var c,h,g,b;(c=e.getElementById("printOverlay"))==null||c.remove(),(h=e.getElementById("printSheet"))==null||h.remove();const l=e.createElement("div");l.id="printSheet",l.className="print-sheet",l.innerHTML=`
    <div class="sheet-header">
      <div>
        <div class="sheet-title">${u(i)}</div>
        ${a?`<div class="sheet-note">${u(a)}</div>`:""}
      </div>
      <div class="sheet-meta">
        <div><strong>Fecha:</strong> ${u(r)}</div>
        ${t?`<div><strong>Escala (referencial):</strong> ${u(t)}</div>`:""}
      </div>
    </div>

    <div class="sheet-map">
      <img id="printSheetImg" src="${s}" alt="Mapa" />
    </div>

    <div class="sheet-footer">
      <div>GeoVisor Carmen de Apicalá</div>
      <div>Generado desde vista actual</div>
    </div>
  `,e.body.appendChild(l);const o=e.createElement("div");o.id="printOverlay",o.className="print-overlay",o.innerHTML=`
    <div class="print-modal">
      <div class="print-modal-header">
        <div class="pm-title">
          <div class="pm-h1">${u(i)}</div>
          ${a?`<div class="pm-note">${u(a)}</div>`:""}
        </div>
        <div class="pm-meta">
          <div><strong>Fecha:</strong> ${u(r)}</div>
          ${t?`<div><strong>Escala (referencial):</strong> ${u(t)}</div>`:""}
        </div>
      </div>

      <div class="print-map-wrap">
        <img id="printPreviewImg" src="${s}" alt="Mapa" />
      </div>

      <div class="print-modal-actions">
        <button class="btn btn-primary" id="btnDoPrint">
          <i class="fas fa-print"></i> Imprimir / Guardar PDF
        </button>
        <button class="btn btn-secondary" id="btnClosePrint">
          <i class="fas fa-xmark"></i> Cerrar
        </button>
      </div>

      <div class="hint" style="margin-top:.6rem;">
        Si se imprime vacío, normalmente es porque la imagen aún no terminó de cargar. Este módulo espera la carga antes de imprimir.
      </div>
    </div>
  `,e.body.appendChild(o);const p=()=>{o.remove()};(g=o.querySelector("#btnClosePrint"))==null||g.addEventListener("click",p);const v=l.querySelector("#printSheetImg"),m=o.querySelector("#printPreviewImg"),n=d=>new Promise(f=>{if(!d||d.complete&&d.naturalWidth>0)return f();d.onload=()=>f(),d.onerror=()=>f()});(b=o.querySelector("#btnDoPrint"))==null||b.addEventListener("click",async()=>{try{await n(v),await n(m),l.offsetHeight,window.print()}catch(d){console.error("[print] error al imprimir:",d),window.print()}})}function u(e){return String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;")}function S(e){if(e.getElementById("printStylesV3"))return;const i=e.createElement("style");i.id="printStylesV3",i.textContent=`
    /* Overlay */
    .print-overlay{
      position: fixed; inset: 0;
      background: rgba(0,0,0,.45);
      z-index: 9999;
      display:flex;
      align-items: center;
      justify-content: center;
      padding: 14px;
    }
    .print-modal{
      width: min(980px, 100%);
      max-height: 92vh;
      overflow: auto;
      background:#fff;
      border-radius: 14px;
      box-shadow: 0 20px 60px rgba(0,0,0,.35);
      border: 1px solid #e5e7eb;
      padding: 14px;
    }
    .print-modal-header{
      display:flex;
      justify-content: space-between;
      gap: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    .pm-h1{ font-weight: 900; color:#111827; font-size: 14px; }
    .pm-note{ color:#6b7280; font-size: 12px; margin-top: 4px; }
    .pm-meta{ color:#6b7280; font-size: 12px; text-align: right; line-height: 1.35; }
    .print-map-wrap{
      margin-top: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 12px;
      overflow: hidden;
      background:#fff;
    }
    .print-map-wrap img{ width:100%; height:auto; display:block; }
    .print-modal-actions{
      display:flex;
      gap:.5rem;
      flex-wrap: wrap;
      justify-content: flex-end;
      margin-top: 12px;
      padding-top: 10px;
      border-top: 1px solid #e5e7eb;
    }

    /* Hoja imprimible (oculta en pantalla) */
    .print-sheet{ display:none; }

    /* Impresión: ocultar toda la app y mostrar solo #printSheet */
    @media print{
    @page { size: A4 landscape; margin: 10mm; }

    /* Ocultar toda la app */
    body * { display: none !important; }

    /* Mostrar solo la hoja */
    #printSheet { display: block !important; }
    #printSheet, #printSheet * { display: block !important; }

    /* Evitar que el contenido “crezca” y pagine */
    #printSheet{
        position: relative !important;
        width: 100% !important;
        height: 100% !important;     /* clave */
        padding: 0 !important;
        overflow: hidden !important; /* clave */
        box-sizing: border-box;
    }

    /* Header / footer sin saltos */
    .sheet-header, .sheet-footer, .sheet-map{
        break-inside: avoid !important;
        page-break-inside: avoid !important;
    }

    /* Reservar altura real para que TODO quepa en una sola hoja */
    .sheet-header{ margin-bottom: 6mm !important; }
    .sheet-footer{
        position: fixed !important;
        left: 10mm !important;
        right: 10mm !important;
        bottom: 8mm !important;      /* clave: lo fija en la misma página */
        margin: 0 !important;
    }

    /* La imagen se ajusta al espacio restante */
    .sheet-map{
        margin: 0 !important;
        border: 0 !important;
    }
    .sheet-map img{
        width: 100% !important;
        height: auto !important;
        max-height: 155mm !important; /* ajusta si aún pagina (bajar a 145mm) */
        object-fit: contain !important;
    }
    }


    /* Estilo de hoja */
    #printSheet{
      font-family: Arial, Helvetica, sans-serif;
      color:#111827;
    }
    .sheet-header{
      display:flex;
      justify-content: space-between;
      gap: 14px;
      padding-bottom: 10px;
      border-bottom: 1px solid #e5e7eb;
    }
    .sheet-title{ font-size: 14px; font-weight: 800; margin:0; }
    .sheet-note{ font-size: 12px; color:#6b7280; margin-top: 4px; }
    .sheet-meta{ font-size: 12px; color:#6b7280; text-align: right; line-height:1.35; }
    .sheet-map{
      margin-top: 12px;
      border: 1px solid #e5e7eb;
      border-radius: 10px;
      overflow: hidden;
    }
    .sheet-map img{ width:100%; height:auto; display:block; }
    .sheet-footer{
      margin-top: 10px;
      font-size: 11px;
      color:#6b7280;
      display:flex;
      justify-content: space-between;
    }
  `,e.head.appendChild(i)}export{P as initPrint};
