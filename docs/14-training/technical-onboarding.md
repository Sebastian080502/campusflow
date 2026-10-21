# Incorporación técnica

1. Lee el README de la raíz y `docs/01-context/overview.md`.
2. Revisa la máquina de estados en `docs/02-domain/entities-and-rules.md` y el ADR 005.
3. Copia `.env.example` a `.env` en la raíz y cambia los placeholders.
4. En `backend`: `npm install`, `npx prisma generate`, `npm test`, `npm run build`.
5. En `frontend`: `npm install`, `npm test`, `npm run dev`. Vite queda en el puerto 5173.
6. Entra con una cuenta de semilla o regístrate como estudiante.
7. El cambio sale de `main` en una rama corta y entra por pull request. Conventional Commits, en inglés.

La política de estados está aislada en `backend/src/domain/request-policy.ts`. Las pruebas de ese archivo no necesitan base de datos.
