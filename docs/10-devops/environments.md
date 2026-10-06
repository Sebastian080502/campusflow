# Ambientes

| Ambiente | Rama | APP_ENV | SEED_ON_START | CORS de ejemplo | Base de ejemplo |
| --- | --- | --- | --- | --- | --- |
| Desarrollo | dev | development | true | http://localhost:5173 | localhost:5432/campusflow |
| QA | qa | qa | false | https://qa.campusflow.example | postgres.qa.internal |
| Producción | main | production | false | https://campusflow.example | postgres.production.internal |

Los archivos `.env.development.example`, `.env.qa.example` y `.env.production.example` solo tienen placeholders. Cada ambiente usa su propio `JWT_SECRET` y su propio host de base. `NODE_ENV` de QA y producción es `production`.

`qa` es el destino de promoción antes de producción. El trabajo nuevo entra por `dev`. `main` no recibe un incremento si las pruebas de extremo a extremo no pudieron ejecutarse.
