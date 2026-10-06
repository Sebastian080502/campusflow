# C4 — Contenedores

```mermaid
flowchart LR
  browser[Navegador]
  web[Cliente React y Vite]
  api[API NestJS]
  db[(PostgreSQL)]
  browser --> web
  web -->|HTTPS JSON /api| api
  api --> db
```

El cliente de desarrollo habla con la API por el proxy de Vite (`/api` → puerto 3000). En Docker, Nginx del cliente reenvía `/api/` al servicio `api`. La API no expone otro protocolo.
