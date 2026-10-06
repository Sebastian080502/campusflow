# Incorporación técnica

1. Lee el README de la raíz y `docs/01-context/overview.md`.
2. Revisa la máquina de estados en `docs/02-domain/entities-and-rules.md` y el ADR 005.
3. Copia `.env.development.example` a `backend/.env` y cambia los placeholders.
4. En `backend`: `npm install`, `npx prisma generate`, `npm test`, `npm run build`.
5. En `frontend`: `npm install`, `npm test`, `npm run dev`.
6. Entra con una cuenta de semilla o regístrate como estudiante.
7. Los commits van a `dev` con Conventional Commits. `qa` es la promoción previa a `main`.

La política de estados está aislada en `backend/src/domain/request-policy.ts`. Las pruebas de ese archivo no necesitan base de datos.
