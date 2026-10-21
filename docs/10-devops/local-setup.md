# Puesta en marcha local

Requisitos: Node.js 22, npm y, para la base, Docker con PostgreSQL 16 o un PostgreSQL local.

1. Copia `.env.example` a `.env` en la raíz. No crees `backend/.env`.
2. Sustituye `change-me` y el `JWT_SECRET` de marcador. El secreto debe tener al menos 32 caracteres. No subas ese archivo.
3. En la raíz, con Docker: `docker compose up --build`. La contraseña de Postgres sale de `POSTGRES_PASSWORD`. El servicio `migrate` aplica las migraciones y termina antes de que arranque la API. `POSTGRES_PORT` publica la base en el host; el valor por defecto es 5432. Si ese puerto ya está ocupado, elige otro y usa el mismo en `DATABASE_URL`.
4. Sin Docker, crea la base `campusflow`, exporta `DATABASE_URL` y en `backend` ejecuta `npx prisma migrate deploy` y `npm run start:dev`.
5. En `frontend`: `npm install` y `npm run dev`. El navegador queda en `http://localhost:5173`. Vite escucha en `::` y proxya `/api` a `http://127.0.0.1:3000`.
6. La semilla se corre a mano con `npm run seed` en `backend`. Si `SEED_ON_START=true`, la API también siembra al arrancar en desarrollo.

La semilla no corre en producción.
