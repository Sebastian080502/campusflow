# Ficha: API

- Proceso NestJS en el puerto 3000, prefijo `/api`.
- Módulos: auth, users, categories, requests, health, prisma.
- Política de estados en `src/domain/request-policy.ts`.
- Persistencia Prisma sobre PostgreSQL.
- Arranque: exige `JWT_SECRET` de al menos 32 caracteres y `DATABASE_URL` PostgreSQL.
- Si `SEED_ON_START=true`, siembra categorías y las cuentas cuyas variables `SEED_*_PASSWORD` existan.
- Contrato: [../07-api/contracts/openapi/campusflow.yaml](../07-api/contracts/openapi/campusflow.yaml).
