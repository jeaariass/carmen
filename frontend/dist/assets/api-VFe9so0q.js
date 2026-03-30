import{d as m,a as n,i as p,c as d,g,b}from"./token-Dx6rIqeM.js";const y={VIEWER:"VIEWER"},c={VIEWER:["verCapas","buscarPredio","medirDistancia","medirArea","verTablaAtributos","identificarFeature"],FUNCIONARIO:["verCapas","buscarPredio","medirDistancia","medirArea","verTablaAtributos","identificarFeature","imprimirMapa","capturaCoords","subirArchivos"],EDITOR:["verCapas","buscarPredio","medirDistancia","medirArea","verTablaAtributos","identificarFeature","imprimirMapa","capturaCoords","subirArchivos","subirDocumentos","editarAtributos","verAdminPanel"]};function h(){const e=m();return(e==null?void 0:e.rol)||y.VIEWER}function E(e){const t=h();return(c[t]||c.VIEWER).includes(e)}function v(){document.querySelectorAll("[data-permiso]").forEach(e=>{E(e.dataset.permiso)||(e.style.display="none",e.setAttribute("aria-hidden","true"))})}const A="/api/intranet",x="/CARMEN_DE_APICALA/";function I(){const e=n();return!e||!p(e)?(l(),null):(document.addEventListener("DOMContentLoaded",()=>{v(),C()}),n())}function C(){const e=g(),t=b();e&&(document.querySelectorAll("[data-user-nombre]").forEach(r=>{r.textContent=e.nombre}),document.querySelectorAll("[data-user-rol]").forEach(r=>{r.textContent=e.rol}),t&&document.querySelectorAll("[data-project-nombre]").forEach(r=>{r.textContent=t.nombre}))}async function l(){const e=n();if(e)try{await fetch(`${A}/api/geoauth/session-end`,{method:"POST",headers:{Authorization:`Bearer ${e}`},keepalive:!0})}catch{}d(),window.location.href=`${x}login.html`}function w(){if(!document.getElementById("logoutModal")){const e=document.createElement("div");e.id="logoutModal",e.style.cssText=`
      position:fixed;inset:0;z-index:99999;
      background:rgba(15,23,42,.55);backdrop-filter:blur(4px);
      display:none;align-items:center;justify-content:center;padding:1rem;
    `,e.innerHTML=`
      <div style="
        background:#fff;border-radius:16px;
        width:min(380px,100%);padding:2rem 1.75rem 1.5rem;
        box-shadow:0 32px 80px rgba(0,0,0,.25);
        display:flex;flex-direction:column;align-items:center;gap:.75rem;
        animation:_lgFadeIn .18s ease;
      ">
        <div style="
          width:56px;height:56px;border-radius:50%;
          background:linear-gradient(135deg,#fee2e2,#fecaca);
          display:flex;align-items:center;justify-content:center;
          font-size:1.5rem;color:#dc2626;margin-bottom:.25rem;
        "><i class='fas fa-sign-out-alt'></i></div>

        <div style="text-align:center">
          <div style="font-size:1.05rem;font-weight:800;color:#111827;margin-bottom:.35rem">
            ¿Cerrar sesión?
          </div>
          <div style="font-size:.85rem;color:#6b7280;line-height:1.5">
            Se cerrará tu sesión activa en el GeoVisor.<br>
            Tendrás que volver a iniciar sesión para continuar.
          </div>
        </div>

        <div style="
          display:flex;gap:.6rem;width:100%;margin-top:.5rem;
        ">
          <button id="_lgCancel" style="
            flex:1;padding:.65rem;border-radius:9px;
            border:1.5px solid #e5e7eb;background:#f9fafb;
            font-size:.88rem;font-weight:700;cursor:pointer;color:#374151;
            transition:background .15s;
          ">Cancelar</button>
          <button id="_lgConfirm" style="
            flex:1;padding:.65rem;border-radius:9px;
            border:none;background:linear-gradient(135deg,#dc2626,#b91c1c);
            font-size:.88rem;font-weight:700;cursor:pointer;color:#fff;
            display:flex;align-items:center;justify-content:center;gap:.4rem;
            transition:opacity .15s;
          "><i class='fas fa-sign-out-alt'></i> Cerrar sesión</button>
        </div>
      </div>
      <style>
        @keyframes _lgFadeIn {
          from { opacity:0; transform:scale(.93) translateY(8px); }
          to   { opacity:1; transform:scale(1)  translateY(0);    }
        }
        #_lgCancel:hover  { background:#f3f4f6; }
        #_lgConfirm:hover { opacity:.88; }
      </style>
    `,document.body.appendChild(e),e.addEventListener("click",t=>{t.target===e&&(e.style.display="none")}),document.getElementById("_lgCancel").addEventListener("click",()=>{e.style.display="none"}),document.getElementById("_lgConfirm").addEventListener("click",()=>{e.style.display="none",l()})}document.querySelectorAll("#btnLogout, [data-logout]").forEach(e=>{e.addEventListener("click",t=>{t.preventDefault(),document.getElementById("logoutModal").style.display="flex"})})}const i="/api/intranet",k="/CARMEN_DE_APICALA/";async function a(e,t,r={}){const s=n(),u={"Content-Type":"application/json",...s?{Authorization:`Bearer ${s}`}:{},...r.headers},o=await fetch(`${e}${t}`,{...r,headers:u});if(o.status===401){d(),window.location.href=`${k}login.html`;return}if(!o.ok){const f=await o.json().catch(()=>({}));throw new Error(f.error||`Error HTTP ${o.status}`)}return o.json()}const S={reportLayerView(e,t){const r=n();r&&fetch(`${i}/api/geoauth/layer-view`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${r}`},body:JSON.stringify({layerName:e,layerTitle:t})}).catch(()=>{})},sessionEnd(){const e=n();e&&fetch(`${i}/api/geoauth/session-end`,{method:"POST",headers:{Authorization:`Bearer ${e}`},keepalive:!0}).catch(()=>{})},getUsers(e){return a(i,`/api/geoprojects/${e}/users`)},createUser(e,t){return a(i,`/api/geoprojects/${e}/users`,{method:"POST",body:JSON.stringify(t)})},toggleUser(e,t){return a(i,`/api/geoprojects/${e}/users/${t}/toggle`,{method:"PATCH"})}};export{v as a,w as b,S as i,E as p,I as r};
