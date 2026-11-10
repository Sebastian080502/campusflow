# ADR 002 — Stack

## Estado

Aceptada.

## Decisión

- TypeScript en API y cliente.
- NestJS para la API HTTP.
- React con Vite para la SPA.
- PostgreSQL como base.
- Prisma como acceso a datos y migraciones.
- bcryptjs con costo 12.

## Consecuencias

El cliente de Prisma se genera antes de compilar y de probar. Las migraciones SQL viven en `backend/prisma/migrations`.
