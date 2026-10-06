# Puesta en marcha local

Requisitos: Node.js 22, npm y, para la base, Docker con PostgreSQL 16 o un PostgreSQL local.

1. Copia `.env.development.example` a `.env` en la raíz y también a `backend/.env`.
2. Sustituye `change-me` y el `JWT_SECRET` de marcador. El secreto debe tener al menos 32 caracteres. No subas esos archivos.
3. En la raíz, con Docker: `docker compose up --build`. La contraseña de Postgres sale de `POSTGRES_PASSWORD`.
4. Sin Docker, crea la base `campusflow`, exporta `DATABASE_URL` y en `backend` ejecuta `npx prisma migrate deploy` y `npm run start:dev`.
5. En `frontend`: `npm install` y `npm run dev`. El navegador queda en `http://localhost:5173`.
6. Con `SEED_ON_START=true` la API siembra las cinco categorías y las cuentas cuyas variables `SEED_*_PASSWORD` estén definidas.

La semilla no corre en QA ni en producción.
