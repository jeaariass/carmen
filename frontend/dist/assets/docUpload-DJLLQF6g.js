import{a as E}from"./token-Dx6rIqeM.js";const z="/api/gv/carmen";function j(o){const e=(o==null?void 0:o.root)||document;T(e),$(e);const c=e.getElementById("btnDocUploadOpen");if(!c)return;const s=e.getElementById("docUploadOverlay"),L=e.getElementById("docUploadClose"),k=e.getElementById("docUploadForm"),u=e.getElementById("docUploadCategoria"),l=e.getElementById("docUploadDropzone"),m=e.getElementById("docUploadInput"),b=e.getElementById("docUploadFileList"),p=e.getElementById("docUploadProgress"),h=e.getElementById("docUploadResult");let n=[];c.addEventListener("click",()=>{s.classList.add("open"),U()}),L.addEventListener("click",x),s.addEventListener("click",r=>{r.target===s&&x()});function x(){s.classList.remove("open"),y()}function y(){n=[],m.value="",v(),h.innerHTML=""}async function U(){try{const a=await(await fetch(`${z}/docs/categorias`,{headers:{Authorization:`Bearer ${E()}`}})).json();u.innerHTML=a.map(t=>`<option value="${t.key}">${t.nombre}</option>`).join("")}catch{u.innerHTML=`
        <option value="normativa">Normativa</option>
        <option value="diagnosticos">Diagnósticos</option>
        <option value="cartografia">Cartografía</option>`}}l.addEventListener("dragover",r=>{r.preventDefault(),l.classList.add("drag-over")}),l.addEventListener("dragleave",()=>l.classList.remove("drag-over")),l.addEventListener("drop",r=>{r.preventDefault(),l.classList.remove("drag-over"),w(Array.from(r.dataTransfer.files))}),l.addEventListener("click",()=>m.click()),m.addEventListener("change",()=>w(Array.from(m.files)));function w(r){const a=[".pdf",".jpg",".jpeg",".png",".webp",".xlsx",".docx"];r.forEach(t=>{const i=t.name.substring(t.name.lastIndexOf(".")).toLowerCase();if(!a.includes(i)){g(`❌ Tipo no permitido: ${t.name}`,"error");return}n.find(d=>d.name===t.name&&d.size===t.size)||n.push(t)}),v()}function v(){if(!n.length){b.innerHTML='<div class="du-empty">Sin archivos seleccionados</div>';return}b.innerHTML=n.map((r,a)=>`
      <div class="du-file-row">
        <span class="du-file-icon">${C(r.name)}</span>
        <span class="du-file-name">${S(r.name)}</span>
        <span class="du-file-size">${I(r.size)}</span>
        <button class="du-remove" data-idx="${a}" title="Quitar">✕</button>
      </div>`).join(""),b.querySelectorAll(".du-remove").forEach(r=>{r.addEventListener("click",()=>{n.splice(Number(r.dataset.idx),1),v()})})}k.addEventListener("submit",async r=>{if(r.preventDefault(),!n.length)return g("Selecciona al menos un archivo.","error");const a=u.value,t=new FormData;t.append("categoria",a),n.forEach(i=>t.append("files",i)),p.style.display="block",p.querySelector(".du-bar-fill").style.width="0%";try{const i=await B(t,d=>{p.querySelector(".du-bar-fill").style.width=d+"%",p.querySelector(".du-bar-label").textContent=d+"%"});g(`✅ ${n.length} archivo(s) subido(s) correctamente a <strong>${u.options[u.selectedIndex].text}</strong>.<br>
         Ya están disponibles en el Repositorio documental.`,"success"),y()}catch(i){g(`❌ Error: ${i.message}`,"error")}finally{setTimeout(()=>{p.style.display="none"},1200)}});function B(r,a){return new Promise((t,i)=>{const d=new XMLHttpRequest;d.open("POST",`${z}/docs/upload`),d.setRequestHeader("Authorization",`Bearer ${E()}`),d.upload.onprogress=f=>{f.lengthComputable&&a(Math.round(f.loaded/f.total*100))},d.onload=()=>{if(d.status>=200&&d.status<300)a(100),t(JSON.parse(d.responseText));else{const f=JSON.parse(d.responseText||"{}");i(new Error(f.error||`HTTP ${d.status}`))}},d.onerror=()=>i(new Error("Error de red")),d.send(r)})}function g(r,a){h.innerHTML=`<div class="du-result du-result--${a}">${r}</div>`}console.log("[docUpload] listo.")}function C(o){const e=o.substring(o.lastIndexOf(".")).toLowerCase();return e===".pdf"?"📄":[".jpg",".jpeg",".png",".webp"].includes(e)?"🖼️":[".xlsx",".docx"].includes(e)?"📊":"📎"}function I(o){return o<1024?o+" B":o<1048576?(o/1024).toFixed(1)+" KB":(o/1048576).toFixed(1)+" MB"}function S(o){return String(o).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}function $(o){var c;if(o.getElementById("docUploadOverlay"))return;const e=o.createElement("div");e.id="docUploadOverlay",e.className="du-overlay",e.innerHTML=`
    <div class="du-window">
      <div class="du-header">
        <div class="du-header-title">
          <i class="fas fa-cloud-upload-alt"></i>
          Cargar documentos al repositorio
        </div>
        <button id="docUploadClose" class="du-close" title="Cerrar">✕</button>
      </div>

      <div class="du-body">
        <form id="docUploadForm">

          <!-- Selección de categoría -->
          <div class="du-section">
            <label class="du-label">
              <i class="fas fa-folder"></i> Categoría destino
            </label>
            <select id="docUploadCategoria" class="du-select">
              <option value="normativa">Normativa</option>
              <option value="diagnosticos">Diagnósticos</option>
              <option value="cartografia">Cartografía</option>
            </select>
            <p class="du-hint">
              El archivo quedará disponible automáticamente en el Repositorio documental bajo esta carpeta.
            </p>
          </div>

          <!-- Dropzone -->
          <div class="du-section">
            <label class="du-label">
              <i class="fas fa-file-upload"></i> Archivos
            </label>
            <div id="docUploadDropzone" class="du-dropzone">
              <i class="fas fa-cloud-upload-alt du-drop-icon"></i>
              <p class="du-drop-text">Arrastra archivos aquí o haz clic para seleccionar</p>
              <p class="du-drop-hint">PDF, JPG, PNG, WEBP, XLSX, DOCX · Máx. 50 MB por archivo</p>
              <input id="docUploadInput" type="file" multiple
                accept=".pdf,.jpg,.jpeg,.png,.webp,.xlsx,.docx" hidden />
            </div>
          </div>

          <!-- Lista de archivos pendientes -->
          <div class="du-section">
            <div id="docUploadFileList" class="du-file-list">
              <div class="du-empty">Sin archivos seleccionados</div>
            </div>
          </div>

          <!-- Barra de progreso -->
          <div id="docUploadProgress" class="du-progress" style="display:none">
            <div class="du-bar">
              <div class="du-bar-fill"></div>
            </div>
            <span class="du-bar-label">0%</span>
          </div>

          <!-- Resultado -->
          <div id="docUploadResult"></div>

          <!-- Botones -->
          <div class="du-actions">
            <button type="button" id="docUploadClose2" class="du-btn du-btn-ghost">Cancelar</button>
            <button type="submit" class="du-btn du-btn-primary">
              <i class="fas fa-cloud-upload-alt"></i> Subir archivos
            </button>
          </div>
        </form>
      </div>
    </div>`,o.body.appendChild(e),(c=o.getElementById("docUploadClose2"))==null||c.addEventListener("click",()=>{var s;(s=o.getElementById("docUploadOverlay"))==null||s.classList.remove("open")})}function T(o){if(o.getElementById("docUploadStyles"))return;const e=o.createElement("style");e.id="docUploadStyles",e.textContent=`
    .du-overlay{
      position:fixed;inset:0;background:rgba(0,0,0,.48);
      z-index:10000;display:none;align-items:center;justify-content:center;padding:1rem;
    }
    .du-overlay.open{display:flex;}
    .du-window{
      background:#fff;border-radius:14px;
      width:min(640px,100%);max-height:90vh;overflow:auto;
      box-shadow:0 24px 64px rgba(0,0,0,.28);
      display:flex;flex-direction:column;
    }
    .du-header{
      display:flex;justify-content:space-between;align-items:center;
      padding:1rem 1.25rem;border-bottom:1px solid #e5e7eb;flex-shrink:0;
      background:#f9fafb;border-radius:14px 14px 0 0;
    }
    .du-header-title{font-weight:800;font-size:.95rem;color:#111827;display:flex;align-items:center;gap:.5rem;}
    .du-header-title i{color:#2563eb;}
    .du-close{background:none;border:none;font-size:1.1rem;cursor:pointer;color:#6b7280;padding:.2rem .4rem;border-radius:6px;}
    .du-close:hover{background:#f3f4f6;color:#111827;}
    .du-body{padding:1.25rem;overflow:auto;}
    .du-section{margin-bottom:1.1rem;}
    .du-label{display:flex;align-items:center;gap:.4rem;font-size:.83rem;font-weight:700;color:#374151;margin-bottom:.4rem;}
    .du-label i{color:#2563eb;}
    .du-select{
      width:100%;padding:.48rem .7rem;border:1.5px solid #d1d5db;
      border-radius:8px;font-size:.85rem;color:#111827;background:#fff;
      outline:none;transition:border-color .2s;
    }
    .du-select:focus{border-color:#2563eb;}
    .du-hint{font-size:.77rem;color:#6b7280;margin-top:.3rem;line-height:1.4;}
    .du-dropzone{
      border:2px dashed #d1d5db;border-radius:10px;
      padding:1.75rem 1rem;text-align:center;cursor:pointer;
      transition:border-color .2s,background .2s;
      background:#fafafa;
    }
    .du-dropzone:hover,.du-dropzone.drag-over{border-color:#2563eb;background:#eff6ff;}
    .du-drop-icon{font-size:2rem;color:#9ca3af;margin-bottom:.5rem;display:block;}
    .du-dropzone:hover .du-drop-icon,.du-dropzone.drag-over .du-drop-icon{color:#2563eb;}
    .du-drop-text{font-size:.88rem;font-weight:600;color:#374151;margin-bottom:.25rem;}
    .du-drop-hint{font-size:.76rem;color:#9ca3af;}
    .du-file-list{display:flex;flex-direction:column;gap:.35rem;max-height:180px;overflow:auto;}
    .du-empty{color:#9ca3af;font-size:.82rem;padding:.4rem 0;}
    .du-file-row{
      display:grid;grid-template-columns:auto 1fr auto auto;
      align-items:center;gap:.5rem;
      padding:.4rem .55rem;border:1px solid #e5e7eb;border-radius:7px;background:#fff;font-size:.82rem;
    }
    .du-file-name{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#111827;}
    .du-file-size{color:#6b7280;white-space:nowrap;font-size:.76rem;}
    .du-remove{background:none;border:none;cursor:pointer;color:#9ca3af;font-size:.85rem;padding:.1rem .3rem;border-radius:4px;}
    .du-remove:hover{color:#dc2626;background:#fee2e2;}
    .du-progress{display:flex;align-items:center;gap:.75rem;margin:.75rem 0;}
    .du-bar{flex:1;height:8px;background:#e5e7eb;border-radius:4px;overflow:hidden;}
    .du-bar-fill{height:100%;background:#2563eb;border-radius:4px;transition:width .3s ease;width:0%;}
    .du-bar-label{font-size:.78rem;font-weight:700;color:#2563eb;min-width:32px;text-align:right;}
    .du-result{padding:.6rem .85rem;border-radius:8px;font-size:.84rem;line-height:1.5;margin:.5rem 0;}
    .du-result--success{background:#f0fdf4;border:1px solid #bbf7d0;color:#166534;}
    .du-result--error  {background:#fef2f2;border:1px solid #fca5a5;color:#b91c1c;}
    .du-actions{display:flex;justify-content:flex-end;gap:.5rem;margin-top:1rem;padding-top:.9rem;border-top:1px solid #e5e7eb;}
    .du-btn{
      display:inline-flex;align-items:center;gap:.35rem;
      padding:.45rem .95rem;border-radius:8px;border:none;
      font-size:.85rem;font-weight:700;cursor:pointer;transition:all .15s;
    }
    .du-btn-primary{background:#2563eb;color:#fff;}
    .du-btn-primary:hover{background:#1d4ed8;}
    .du-btn-ghost{background:#f3f4f6;color:#374151;border:1px solid #e5e7eb;}
    .du-btn-ghost:hover{background:#e5e7eb;}
  `,o.head.appendChild(e)}export{j as initDocUpload};
