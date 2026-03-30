function W(a){const d=(a==null?void 0:a.root)||document,k=d.querySelector("#btnDocRepoOpen");if(!k)return console.warn("[docRepo] No existe #btnDocRepoOpen en el DOM."),!1;V(d),B(d);const s=d.querySelector("#docRepoOverlay"),h=s.querySelector("#docRepoClose"),m=s.querySelector("#docRepoFolders"),v=s.querySelector("#docRepoFiles"),R=s.querySelector("#docRepoViewer"),f=s.querySelector("#docRepoSearch"),l=s.querySelector("#docRepoLayerFilter"),y=s.querySelector("#docRepoRecents"),O="/api/gv/carmen/docs/manifest",S="docRepo_recents_v1",T=15;let n=[],u=null;const i=e=>String(e??"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#039;");function j(){s.classList.add("open")}function L(){s.classList.remove("open")}function $(){try{const e=localStorage.getItem(S),o=e?JSON.parse(e):[];return Array.isArray(o)?o:[]}catch{return[]}}function z(e){const o=$(),r=new Date().toISOString(),t=[{...e,viewedAt:r},...o.filter(c=>(c==null?void 0:c.id)!==(e==null?void 0:e.id))].slice(0,T);localStorage.setItem(S,JSON.stringify(t)),x()}function x(){const e=$();if(y){if(!e.length){y.innerHTML='<div class="docrepo-empty">Sin documentos recientes.</div>';return}y.innerHTML=e.map(o=>`
      <button class="docrepo-recent" type="button" data-id="${i(o.id)}">
        <div class="docrepo-recent-title">${i(o.title||"Documento")}</div>
        <div class="docrepo-recent-meta">${i((o.type||"").toUpperCase())} · ${i(o.viewedAt||"")}</div>
      </button>
    `).join(""),y.querySelectorAll("button[data-id]").forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-id"),t=E(r);t&&(u=t.folder.key,w(),g(),A(t.file,t.folder))})})}}function E(e){for(const o of n)for(const r of o.files||[])if((r==null?void 0:r.id)===e)return{folder:o,file:r};return null}function D(){const e=new Set;return n.forEach(o=>(o.layers||[]).forEach(r=>e.add(r))),Array.from(e).sort()}function N(){if(!l)return;const e=D();l.innerHTML=`
      <option value="">Todas las capas</option>
      ${e.map(o=>`<option value="${i(o)}">${i(o)}</option>`).join("")}
    `}function w(){m&&(!u&&n.length&&(u=n[0].key),m.innerHTML=n.map(e=>{const o=e.key===u?"active":"",r=(e.layers||[]).length?`${e.layers.length} capa(s)`:"Sin capa",t=(e.files||[]).length;return`
        <button class="docrepo-folder ${o}" type="button" data-key="${i(e.key)}">
          <div class="docrepo-folder-name">${i(e.name||e.key)}</div>
          <div class="docrepo-folder-meta">${i(r)} · ${i(t)} archivo(s)</div>
        </button>
      `}).join(""),m.querySelectorAll("button[data-key]").forEach(e=>{e.addEventListener("click",()=>{u=e.getAttribute("data-key"),w(),g()})}))}function H(){const e=n.find(c=>c.key===u);if(!e)return[];const o=((f==null?void 0:f.value)||"").trim().toLowerCase(),r=((l==null?void 0:l.value)||"").trim();if(r&&!(e.layers||[]).includes(r))return[];let t=(e.files||[]).map(c=>({folder:e,file:c}));return o&&(t=t.filter(c=>{var q,F,M;const p=(((q=c.file)==null?void 0:q.title)||"").toLowerCase(),b=(((F=c.file)==null?void 0:F.id)||"").toLowerCase(),U=(((M=c.file)==null?void 0:M.file)||"").toLowerCase();return p.includes(o)||b.includes(o)||U.includes(o)})),t}function g(){if(!v)return;const e=H();if(!e.length){v.innerHTML='<div class="docrepo-empty">No hay documentos para los filtros actuales.</div>';return}v.innerHTML=e.map(({folder:o,file:r})=>{const t=(r.type||C(r.file)).toUpperCase(),c=(o.layers||[]).slice(0,3).map(b=>`<span class="docrepo-chip">${i(b)}</span>`).join(""),p=(o.layers||[]).length>3?`<span class="docrepo-chip">+${(o.layers||[]).length-3}</span>`:"";return`
        <button class="docrepo-file" type="button" data-id="${i(r.id)}">
          <div class="docrepo-file-title">${i(r.title||"Documento")}</div>
          <div class="docrepo-file-meta">
            <span class="docrepo-badge">${i(t)}</span>
            <span class="docrepo-path">${i(r.file||"")}</span>
          </div>
          <div class="docrepo-chips">${c}${p}</div>
        </button>
      `}).join(""),v.querySelectorAll("button[data-id]").forEach(o=>{o.addEventListener("click",()=>{const r=o.getAttribute("data-id"),t=E(r);t&&A(t.file,t.folder)})})}function C(e){const o=String(e||"").toLowerCase();return o.endsWith(".pdf")?"pdf":o.endsWith(".png")||o.endsWith(".jpg")||o.endsWith(".jpeg")||o.endsWith(".webp")?"image":"file"}function A(e,o){if(!R)return;const r=e.type||C(e.file),t="/gv-carmen-docs/"+String(e.file||"").replace(/^\/+/,""),c=`
      <div class="docrepo-viewer-head">
        <div>
          <div class="docrepo-viewer-title">${i(e.title||"Documento")}</div>
          <div class="docrepo-viewer-sub">
            <span class="docrepo-badge">${i(String(r).toUpperCase())}</span>
            <span class="docrepo-viewer-path">${i(e.file||"")}</span>
          </div>
          <div class="docrepo-viewer-layers">
            ${(o.layers||[]).map(b=>`<span class="docrepo-chip">${i(b)}</span>`).join("")}
          </div>
        </div>
        <div class="docrepo-viewer-actions">
          <a class="docrepo-link" href="${t}" target="_blank" rel="noreferrer">Abrir en pestaña</a>
        </div>
      </div>
    `;let p="";r==="pdf"?p=`<iframe class="docrepo-iframe" src="${t}"></iframe>`:r==="image"?p=`<div class="docrepo-image-wrap"><img class="docrepo-image" src="${t}" alt="${i(e.title)}"></div>`:p=`
        <div class="docrepo-generic">
          <p>No hay previsualización para este tipo.</p>
          <a class="docrepo-link" href="${t}" target="_blank" rel="noreferrer">Descargar / abrir</a>
        </div>
      `,R.innerHTML=c+`<div class="docrepo-viewer-body">${p}</div>`,console.log("[docRepo] open",{id:e.id,title:e.title,type:r,file:e.file,folder:o==null?void 0:o.key,layers:(o==null?void 0:o.layers)||[]}),z({id:e.id,title:e.title,type:r,file:e.file,folderKey:(o==null?void 0:o.key)||""})}async function I(){try{const e=localStorage.getItem("ctg_token")||"";if(!e){console.error("[docRepo] Sin token de sesión"),n=[];return}const o=await fetch(O,{cache:"no-store",headers:{Authorization:"Bearer "+e}});if(!o.ok)throw new Error("HTTP "+o.status);const r=await o.json();if(!Array.isArray(r))throw new Error("Respuesta no es un array");n=r}catch(e){console.error("[docRepo] Error cargando manifiesto:",e),n=[]}}async function _(){await I(),N(),w(),g(),x()}return k.addEventListener("click",async()=>{j(),await _()}),h==null||h.addEventListener("click",()=>L()),s.addEventListener("click",e=>{e.target===s&&L()}),f==null||f.addEventListener("input",()=>g()),l==null||l.addEventListener("change",()=>g()),x(),console.log("[docRepo] listo."),!0}function B(a){if(a.getElementById("docRepoOverlay"))return;const d=a.createElement("div");d.id="docRepoOverlay",d.className="docrepo-overlay",d.setAttribute("aria-hidden","true"),d.innerHTML=`
    <div class="docrepo-window" role="dialog" aria-modal="true">
      <div class="docrepo-topbar">
        <div class="docrepo-title">Repositorio documental vinculado a capas</div>

        <div class="docrepo-controls">
          <select id="docRepoLayerFilter" class="docrepo-select" title="Filtrar por capa">
            <option value="">Todas las capas</option>
          </select>

          <input id="docRepoSearch" class="docrepo-search" type="search"
                 placeholder="Buscar por título, id o ruta...">

          <button id="docRepoClose" class="docrepo-close" type="button" title="Cerrar">Cerrar</button>
        </div>
      </div>

      <div class="docrepo-body">
        <aside class="docrepo-left">
          <div class="docrepo-section-title">Carpetas</div>
          <div id="docRepoFolders" class="docrepo-folders"></div>

          <div class="docrepo-section-title" style="margin-top:16px;">Recientes (local)</div>
          <div id="docRepoRecents" class="docrepo-recents"></div>
        </aside>

        <main class="docrepo-center">
          <div class="docrepo-section-title">Documentos</div>
          <div id="docRepoFiles" class="docrepo-files"></div>
        </main>

        <section class="docrepo-right">
          <div class="docrepo-section-title">Visor</div>
          <div id="docRepoViewer" class="docrepo-viewer">
            <div class="docrepo-empty">Seleccione un documento para previsualizar.</div>
          </div>
        </section>
      </div>
    </div>
  `,a.body.appendChild(d)}function V(a){if(a.getElementById("docRepoStylesV1"))return;const d=a.createElement("style");d.id="docRepoStylesV1",d.textContent=`
    .docrepo-overlay{
      position: fixed; inset: 0;
      background: rgba(0,0,0,.45);
      display: none;
      z-index: 9999;
    }
    .docrepo-overlay.open{ display:block; }

    .docrepo-window{
      position: absolute;
      inset: 18px;
      background: #fff;
      border-radius: 14px;
      overflow: hidden;
      display: flex;
      flex-direction: column;
      box-shadow: 0 20px 60px rgba(0,0,0,.25);
      border: 1px solid #e5e7eb;
    }

    .docrepo-topbar{
      padding: 12px 14px;
      border-bottom: 1px solid #e9e9e9;
      display:flex;
      gap: 12px;
      align-items:center;
      justify-content: space-between;
    }
    .docrepo-title{ font-weight: 800; color:#111827; }
    .docrepo-controls{ display:flex; gap: 10px; align-items:center; }

    .docrepo-select, .docrepo-search{
      height: 34px;
      border: 1px solid #ddd;
      border-radius: 10px;
      padding: 0 10px;
      outline: none;
    }
    .docrepo-search{ width: 340px; }

    .docrepo-close{
      height: 34px;
      border: 1px solid #ddd;
      border-radius: 10px;
      background: #f7f7f7;
      padding: 0 12px;
      cursor: pointer;
    }

    .docrepo-body{
      flex: 1;
      display: grid;
      grid-template-columns: 320px 380px 1fr;
      min-height: 0;
    }

    .docrepo-left, .docrepo-center, .docrepo-right{
      min-height: 0;
      padding: 12px;
    }
    .docrepo-left{ border-right: 1px solid #eee; }
    .docrepo-center{ border-right: 1px solid #eee; }

    /* ===== FIX SCROLL REAL EN "DOCUMENTOS" ===== */
    .docrepo-center{
      display: flex;
      flex-direction: column;
      min-height: 0;  /* clave para que el hijo pueda scrollear dentro */
    }

    .docrepo-center .docrepo-files{
      flex: 1;
      min-height: 0;  /* clave */
      overflow: auto; /* scroll real */
    }

    /* (Opcional) si también quiere que "Carpetas" y "Recientes" sean scrollables dentro del alto */
    .docrepo-left{
      display: flex;
      flex-direction: column;
      min-height: 0;
    }

    .docrepo-left .docrepo-folders{
      flex: 1;
      min-height: 0;
      overflow: auto;
    }

    .docrepo-left .docrepo-recents{
      flex: 1;
      min-height: 0;
      overflow: auto;
    }


    .docrepo-section-title{
      font-size: 12px;
      font-weight: 800;
      color: #444;
      margin-bottom: 10px;
      text-transform: uppercase;
      letter-spacing: .4px;
    }

    .docrepo-folders, .docrepo-files, .docrepo-recents{
      display:flex;
      flex-direction: column;
      gap: 8px;
      overflow: auto;
      padding-right: 6px;
    }

    .docrepo-folder, .docrepo-file, .docrepo-recent{
      text-align: left;
      border: 1px solid #eee;
      border-radius: 12px;
      background: #fff;
      padding: 10px 10px;
      cursor: pointer;
    }
    .docrepo-folder.active{
      border-color: #cfd8ff;
      background: #f6f7ff;
    }
    .docrepo-folder-name{ font-weight: 800; }
    .docrepo-folder-meta, .docrepo-file-meta, .docrepo-recent-meta{
      font-size: 12px;
      color: #666;
      margin-top: 3px;
    }
    .docrepo-file-title, .docrepo-recent-title{ font-weight: 800; }

    .docrepo-badge{
      display:inline-block;
      font-size: 11px;
      border: 1px solid #ddd;
      border-radius: 999px;
      padding: 1px 8px;
      margin-right: 6px;
      background:#fafafa;
    }
    .docrepo-path{ font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

    .docrepo-chips{ margin-top: 8px; display:flex; gap: 6px; flex-wrap: wrap; }
    .docrepo-chip{
      font-size: 11px;
      border: 1px solid #e6e6e6;
      border-radius: 999px;
      padding: 2px 8px;
      background:#f8f8f8;
      color:#333;
    }

    .docrepo-viewer{
      height: 100%;
      border: 1px solid #eee;
      border-radius: 12px;
      overflow: hidden;
      background: #fff;
      display:flex;
      flex-direction: column;
    }
    .docrepo-viewer-head{
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
      display:flex;
      justify-content: space-between;
      gap: 10px;
    }
    .docrepo-viewer-title{ font-weight: 900; }
    .docrepo-viewer-sub{ font-size: 12px; color:#666; margin-top: 3px; }
    .docrepo-viewer-layers{ margin-top: 8px; display:flex; gap: 6px; flex-wrap: wrap; }

    .docrepo-viewer-body{ flex:1; min-height: 0; padding: 0; }
    .docrepo-iframe{ width: 100%; height: 100%; border: 0; }
    .docrepo-image-wrap{ height:100%; overflow:auto; padding: 10px; }
    .docrepo-image{
      max-width:100%;
      height:auto;
      display:block;
      border-radius: 10px;
      border: 1px solid #eee;
    }

    .docrepo-link{
      display:inline-block;
      text-decoration: none;
      border: 1px solid #ddd;
      background: #f7f7f7;
      border-radius: 10px;
      padding: 6px 10px;
      color:#111;
      white-space: nowrap;
    }

    .docrepo-empty{
      padding: 14px;
      color: #666;
      font-size: 13px;
    }
    
    /* Forzar barras de scroll visibles en paneles */
    .docrepo-folders, .docrepo-files, .docrepo-recents, .docrepo-image-wrap{
      overflow-y: scroll;           /* fuerza barra aunque no se vea por defecto */
      scrollbar-gutter: stable;     /* reserva espacio para que no “salte” el layout */
    }

    /* Scrollbar visible (Chrome/Edge/Safari) */
    .docrepo-folders::-webkit-scrollbar,
    .docrepo-files::-webkit-scrollbar,
    .docrepo-recents::-webkit-scrollbar,
    .docrepo-image-wrap::-webkit-scrollbar{
      width: 10px;
    }

    .docrepo-folders::-webkit-scrollbar-track,
    .docrepo-files::-webkit-scrollbar-track,
    .docrepo-recents::-webkit-scrollbar-track,
    .docrepo-image-wrap::-webkit-scrollbar-track{
      background: #f3f4f6;
      border-radius: 999px;
    }

    .docrepo-folders::-webkit-scrollbar-thumb,
    .docrepo-files::-webkit-scrollbar-thumb,
    .docrepo-recents::-webkit-scrollbar-thumb,
    .docrepo-image-wrap::-webkit-scrollbar-thumb{
      background: #cbd5e1;
      border-radius: 999px;
      border: 2px solid #f3f4f6;
    }

    /* Firefox */
    .docrepo-folders, .docrepo-files, .docrepo-recents, .docrepo-image-wrap{
      scrollbar-width: thin;
      scrollbar-color: #cbd5e1 #f3f4f6;
    }


    @media (max-width: 1100px){
      .docrepo-body{ grid-template-columns: 280px 320px 1fr; }
      .docrepo-search{ width: 240px; }
    }
  `,a.head.appendChild(d)}export{W as initDocRepo};
