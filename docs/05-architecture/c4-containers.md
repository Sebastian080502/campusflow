# C4 — Contenedores

```mermaid
flowchart LR
  browser[Navegador]
  subgraph red [Red de Compose]
    web["web\nnginx 1.27 + build React/Vite\n:80"]
    api["api\nNode 22 + NestJS\n:3000\nsolo red interna"]
    db[("db\nPostgreSQL 16\n:5432\nsolo red interna")]
    vol[("volumen campusflow-db")]
  end
  browser -->|HTTP :80| web
  web -->|"/api hacia api:3000"| api
  api -->|Prisma| db
  db --- vol
```

En producción solo `web` publica el puerto 80. `api` y `db` quedan en la red interna. El volumen `campusflow-db` conserva los datos de PostgreSQL.

El cliente de desarrollo no es ese contenedor: Vite escucha en `::` puerto 5173 y proxya `/api` a `http://127.0.0.1:3000`. La migración no es un contenedor permanente: el servicio `migrate` usa la imagen de la API, ejecuta `prisma migrate deploy` y termina antes de que arranque `api`.
