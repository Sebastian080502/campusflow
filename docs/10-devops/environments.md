# Ambientes

| Ambiente | Dónde vive | APP_ENV | Semilla | CORS de ejemplo |
| --- | --- | --- | --- | --- |
| Desarrollo | Máquina local y ramas cortas | development | `npm run seed` o `SEED_ON_START=true` | http://localhost:5173 |
| Producción | `main`, imágenes en GHCR, EC2 | production | no se ejecuta | https://campusflow.example |

Hay dos plantillas: `.env.example` para desarrollo y `.env.production.example` para la EC2. Solo contienen placeholders. Cada ambiente usa su propio `JWT_SECRET`. La duración del token sale de `JWT_EXPIRES_IN` (por defecto `8h`).

`main` recibe el cambio por pull request. La integración continua ejecuta las pruebas de extremo a extremo antes de construir imágenes.
