# Despliegue

```mermaid
flowchart LR
  usuario([Estudiante · Personal · Admin]) -->|HTTP :80| web
  gh[GitHub PR a main] --> actions[GitHub Actions]
  actions --> ghcr[GHCR campusflow-api y campusflow-web]
  subgraph EC2 [EC2 t3.micro · compose.prod.yml]
    migrate[migrate prisma migrate deploy]
    web[web nginx 1.27 healthcheck :80]
    api[api Node 22 NestJS healthcheck :3000]
    db[(db PostgreSQL 16 :5432)]
    vol[(volumen campusflow-db)]
  end
  ghcr --> web
  ghcr --> api
  ghcr --> migrate
  migrate -->|termina antes| api
  web -->|/api/*| api
  api -->|Prisma| db
  db --- vol
```

GitHub Actions construye las dos imágenes, las analiza con Trivy y, solo en `main`, las publica en GHCR. El despliegue copia `compose.prod.yml` a la EC2 y ejecuta `docker compose pull` y `up -d --wait`. El `.env` de producción permanece en la máquina. Después, `GET /api/health` debe devolver la versión del commit.
