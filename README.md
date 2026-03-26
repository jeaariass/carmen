# GeoVisor Carmen de Apicalá — GV-002
### CTGlobal · Conexión Territorial Global SAS

Plantilla base de geovisor lista para montar sobre la infraestructura CTGlobal.

---

## Estructura del proyecto

```
gv-carmen/
├── backend/                      ← Express :3003
│   ├── src/
│   │   ├── middleware/auth.js    ← Verifica JWT de la intranet
│   │   └── routes/
│   │       ├── verify.js         ← GET /api/verify
│   │       ├── layers.js         ← GET /api/layers (config capas)
│   │       └── files.js          ← GET /api/files/pdfs
│   ├── public/pdf/               ← PDFs del proyecto (agregar aquí)
│   ├── .env.example
│   └── package.json
│
└── frontend/                     ← Vite build → dist/
    ├── login.html
    ├── index.html
    ├── admin-users.html
    ├── src/
    │   ├── auth/                 ← guard.js, login.js, login.css
    │   ├── services/api.js       ← cliente HTTP con token auto
    │   ├── utils/
    │   │   ├── token.js          ← localStorage ctg_*
    │   │   └── permissions.js    ← VIEWER / EDITOR + puedeUsar()
    │   └── js/
    │       ├── main.js           ← OpenLayers + carga condicional de herramientas
    │       ├── admin-users.js    ← CRUD usuarios (llama intranet)
    │       ├── style.css
    │       ├── admin.css
    │       └── [herramientas]    ← identify, measure, layerQuery, etc.
    ├── vite.config.js
    └── .env.example
```

---

## Puesta en marcha

### 1 · Copiar herramientas del geovisor original
Los siguientes archivos van a `frontend/src/js/` sin modificaciones:
```
identify.js   measure.js   layerQuery.js   print.js
upload.js     coordpicker.js  street360.js  layers.js
pdfOverlay.js  docRepo.js   config.js
```

### 2 · Backend
```bash
cd backend
cp .env.example .env        # Editar JWT_SECRET, PORT, INTRANET_URL, etc.
npm install
npm start                   # o: npm run dev (con nodemon)
```

### 3 · Frontend
```bash
cd frontend
cp .env.example .env        # Editar VITE_INTRANET_URL, VITE_PROJECT_API_KEY, etc.
npm install
npm run dev                 # Dev local: http://localhost:5173/CARMEN_DE_APICALA/
npm run build               # Producción → dist/
```

---

## Variables de entorno clave

| Variable | Donde | Valor ejemplo |
|---|---|---|
| `JWT_SECRET` | backend/.env | *mismo que la intranet* |
| `INTRANET_URL` | backend/.env | `http://localhost:3001` |
| `API_KEY` | backend/.env | `ctg_live_gv002_carmen_apicala` |
| `PORT` | backend/.env | `3003` |
| `VITE_INTRANET_URL` | frontend/.env | `https://ctglobal.com.co/api/intranet` |
| `VITE_PROJECT_API_KEY` | frontend/.env | `ctg_live_gv002_carmen_apicala` |
| `VITE_API_URL` | frontend/.env | `/api/gv/carmen` |

> ⚠ `JWT_SECRET` **debe ser idéntico** al de la intranet. Si cambia allá, cambia aquí.

---

## Flujo de autenticación

```
1. login.html → POST intranet/api/geoauth/login (con x-api-key)
2. Intranet valida email+password en project_users
3. Retorna JWT (24h) + sessionId + datos del proyecto
4. Frontend guarda en localStorage: ctg_token, ctg_session, ctg_user, ctg_project
5. Cada petición al backend propio lleva Authorization: Bearer <token>
6. backend/middleware/auth.js verifica con el mismo JWT_SECRET
7. Al logout → POST intranet/api/geoauth/session-end (keepalive)
```

---

## Roles y herramientas

| Herramienta | VIEWER | EDITOR |
|---|:---:|:---:|
| Ver capas WMS | ✓ | ✓ |
| Identificar entidad | ✓ | ✓ |
| Medir área/distancia | ✓ | ✓ |
| Captura de coordenadas | ✓ | ✓ |
| Vista 360° | ✓ | ✓ |
| Tabla de atributos / búsqueda | ✓ | ✓ |
| Imprimir mapa | ✓ | ✓ |
| Descargar PDF | ✓ | ✓ |
| Subir archivos (GeoJSON/KML…) | — | ✓ |
| Editar atributos | — | ✓ |
| Panel gestión de usuarios | — | ✓ |

---

## Despliegue en producción

### Build del frontend
```bash
cd frontend && npm run build
# Copiar dist/ al servidor:
rsync -av dist/ usuario@servidor:/var/www/geovisores/carmen/dist/
```

### PM2 (backend)
```bash
cd backend
pm2 start src/server.js --name gv-carmen
pm2 save
```

### Nginx (agregar en el server block existente)
```nginx
# Frontend estático
location /CARMEN_DE_APICALA/ {
    alias /var/www/geovisores/carmen/dist/;
    try_files $uri $uri/ /CARMEN_DE_APICALA/index.html;
}

# Backend API
location /api/gv/carmen/ {
    proxy_pass http://localhost:3003/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```
```bash
sudo nginx -t && sudo systemctl reload nginx
```

---

## Checklist al crear un geovisor nuevo (replicar esta plantilla)

- [ ] Crear registro en `geo_projects` de la BD de la intranet
- [ ] Generar `api_key` → patrón: `ctg_live_gvXXX_nombre_slug`
- [ ] Crear workspace y capas en GeoServer
- [ ] Copiar esta carpeta con otro nombre
- [ ] Actualizar `.env` del backend (PORT, API_KEY, GEOSERVER_WORKSPACE)
- [ ] Actualizar `.env` del frontend (VITE_PROJECT_API_KEY, VITE_BASE, VITE_PROJECT_NAME)
- [ ] Actualizar `backend/src/routes/layers.js` con las capas reales
- [ ] Actualizar coordenadas del centro en `layers.js`
- [ ] Copiar herramientas de OpenLayers a `frontend/src/js/`
- [ ] Build + deploy
- [ ] Agregar `location` en Nginx
- [ ] Registrar en PM2 ecosystem.config.js
