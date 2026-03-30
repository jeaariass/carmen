(function(){const r=document.createElement("link").relList;if(r&&r.supports&&r.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();const T="modulepreload",O=function(e){return"/CARMEN_DE_APICALA/"+e},E={},m=function(r,t,s){let i=Promise.resolve();if(t&&t.length>0){let o=function(c){return Promise.all(c.map(l=>Promise.resolve(l).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};document.getElementsByTagName("link");const a=document.querySelector("meta[property=csp-nonce]"),d=(a==null?void 0:a.nonce)||(a==null?void 0:a.getAttribute("nonce"));i=o(t.map(c=>{if(c=O(c),c in E)return;E[c]=!0;const l=c.endsWith(".css"),p=l?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${p}`))return;const u=document.createElement("link");if(u.rel=l?"stylesheet":T,l||(u.as="script"),u.crossOrigin="",u.href=c,d&&u.setAttribute("nonce",d),document.head.appendChild(u),l)return new Promise((I,P)=>{u.addEventListener("load",I),u.addEventListener("error",()=>P(new Error(`Unable to preload CSS for ${c}`)))})}))}function n(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return i.then(o=>{for(const a of o||[])a.status==="rejected"&&n(a.reason);return r().catch(n)})},y={TOKEN:"ctg_token",SESSION:"ctg_session",USER:"ctg_user",PROJECT:"ctg_project"};function f(){return localStorage.getItem(y.TOKEN)}function v(){try{return JSON.parse(localStorage.getItem(y.USER))}catch{return null}}function L(){try{return JSON.parse(localStorage.getItem(y.PROJECT))}catch{return null}}function A(e=f()){if(!e)return null;try{return JSON.parse(atob(e.split(".")[1]))}catch{return null}}function x(e=f()){const r=A(e);return r?r.exp*1e3>Date.now():!1}function w(){Object.values(y).forEach(e=>localStorage.removeItem(e))}const R={VIEWER:"VIEWER"},b={VIEWER:["verCapas","buscarPredio","medirDistancia","medirArea","verTablaAtributos","identificarFeature"],FUNCIONARIO:["verCapas","buscarPredio","medirDistancia","medirArea","verTablaAtributos","identificarFeature","imprimirMapa","capturaCoords","subirArchivos"],EDITOR:["verCapas","buscarPredio","medirDistancia","medirArea","verTablaAtributos","identificarFeature","imprimirMapa","capturaCoords","subirArchivos","subirDocumentos","editarAtributos","verAdminPanel"]};function k(){const e=A();return(e==null?void 0:e.rol)||R.VIEWER}function _(e){const r=k();return(b[r]||b.VIEWER).includes(e)}function S(){document.querySelectorAll("[data-permiso]").forEach(e=>{_(e.dataset.permiso)||(e.style.display="none",e.setAttribute("aria-hidden","true"))})}const $="/api/intranet",j="/CARMEN_DE_APICALA/";function D(){const e=f();return!e||!x(e)?(C(),null):(document.addEventListener("DOMContentLoaded",()=>{S(),N()}),f())}function N(){const e=v(),r=L();e&&(document.querySelectorAll("[data-user-nombre]").forEach(t=>{t.textContent=e.nombre}),document.querySelectorAll("[data-user-rol]").forEach(t=>{t.textContent=e.rol}),r&&document.querySelectorAll("[data-project-nombre]").forEach(t=>{t.textContent=r.nombre}))}async function C(){const e=f();if(e)try{await fetch(`${$}/api/geoauth/session-end`,{method:"POST",headers:{Authorization:`Bearer ${e}`},keepalive:!0})}catch{}w(),window.location.href=`${j}login.html`}function U(){if(!document.getElementById("logoutModal")){const e=document.createElement("div");e.id="logoutModal",e.style.cssText=`
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
    `,document.body.appendChild(e),e.addEventListener("click",r=>{r.target===e&&(e.style.display="none")}),document.getElementById("_lgCancel").addEventListener("click",()=>{e.style.display="none"}),document.getElementById("_lgConfirm").addEventListener("click",()=>{e.style.display="none",C()})}document.querySelectorAll("#btnLogout, [data-logout]").forEach(e=>{e.addEventListener("click",r=>{r.preventDefault(),document.getElementById("logoutModal").style.display="flex"})})}const g="/api/intranet",V="/CARMEN_DE_APICALA/";async function h(e,r,t={}){const s=f(),i={"Content-Type":"application/json",...s?{Authorization:`Bearer ${s}`}:{},...t.headers},n=await fetch(`${e}${r}`,{...t,headers:i});if(n.status===401){w(),window.location.href=`${V}login.html`;return}if(!n.ok){const o=await n.json().catch(()=>({}));throw new Error(o.error||`Error HTTP ${n.status}`)}return n.json()}const B={reportLayerView(e,r){const t=f();t&&fetch(`${g}/api/geoauth/layer-view`,{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${t}`},body:JSON.stringify({layerName:e,layerTitle:r})}).catch(()=>{})},sessionEnd(){const e=f();e&&fetch(`${g}/api/geoauth/session-end`,{method:"POST",headers:{Authorization:`Bearer ${e}`},keepalive:!0}).catch(()=>{})},getUsers(e){return h(g,`/api/geoprojects/${e}/users`)},createUser(e,r){return h(g,`/api/geoprojects/${e}/users`,{method:"POST",body:JSON.stringify(r)})},toggleUser(e,r){return h(g,`/api/geoprojects/${e}/users/${r}/toggle`,{method:"PATCH"})}},M=D();if(!M)throw new Error("No autenticado");window.addEventListener("beforeunload",()=>B.sessionEnd());class q{constructor(){this._l={}}on(r,t){var s;((s=this._l)[r]??(s[r]=[])).push(t)}emit(r,t){(this._l[r]||[]).forEach(s=>s(t))}}async function z(){S(),U();const e=v();if(e!=null&&e.nombre){const o=document.getElementById("userInitials");o&&(o.textContent=e.nombre.charAt(0).toUpperCase())}const r=document.getElementById("map"),t={eventBus:new q,mapEl:r,root:document},{initMap:s}=await m(async()=>{const{initMap:o}=await import("./map-BSMtRz_W.js");return{initMap:o}},[]);await s(t);const{initLayers:i}=await m(async()=>{const{initLayers:o}=await import("./layers-CmrU8-mu.js");return{initLayers:o}},[]);await i(t);async function n(o,a,d,...c){if(_(o))try{await(await m(()=>import(`./${a}`),[]))[d](...c)}catch(l){console.warn(`[GeoVisor] ${a}: ${l.message}`)}}await n("identificarFeature","identify.js","initIdentify",t),await n("medirArea","measure.js","initMeasure",t),await n("verTablaAtributos","layerQuery.js","initLayerQueryUI",t.map),await n("imprimirMapa","print.js","initPrint",t),await n("subirArchivos","upload.js","initUploadModule",t),await n("capturaCoords","coordpicker.js","initCoordinatePicker",t);try{const{initDocRepo:o}=await m(async()=>{const{initDocRepo:d}=await import("./docRepo-DhCy7LAx.js");return{initDocRepo:d}},[]),{initDocUpload:a}=await m(async()=>{const{initDocUpload:d}=await import("./docUpload-DetAP3XV.js");return{initDocUpload:d}},[]);o(t),a(t)}catch(o){console.warn("[GeoVisor] docRepo/docUpload:",o.message)}try{const{initSurveys:o}=await m(async()=>{const{initSurveys:a}=await import("./encuestas-C8pfzkKN.js");return{initSurveys:a}},[]);o(t)}catch(o){console.warn("[GeoVisor] encuestas:",o.message)}console.log("[GeoVisor] Listo ✓ — Carmen de Apicalá")}z().catch(e=>console.error("[GeoVisor] Error:",e));export{f as g};
