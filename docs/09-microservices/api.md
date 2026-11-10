# Ficha: API

- Proceso NestJS en el puerto 3000, prefijo `/api`.
- Módulos: auth, users, categories, requests, health, prisma.
- Política de estados en `src/domain/request-policy.ts`. `RequestsService` orquesta esa política y delega el acceso a `RequestsRepository`.
- Persistencia Prisma sobre PostgreSQL. Los códigos `P2002` y `P2025` se traducen en `ApiExceptionFilter`.
- Arranque: exige `JWT_SECRET` de al menos 32 caracteres y `DATABASE_URL` PostgreSQL. Fuera de producción lee un solo `.env` en la raíz. `JWT_EXPIRES_IN` y `APP_VERSION` salen de ese entorno.
- La migración no corre dentro del proceso de la API. En Compose la aplica el servicio `migrate`.
- `GET /api/health` responde estado, base y versión. Si `SELECT 1` falla, responde 503.
- Si `SEED_ON_START=true`, siembra categorías y las cuentas cuyas variables `SEED_*_PASSWORD` existan. En producción esa variable no se define; la semilla es `npm run seed`.
- Contrato: [../07-api/contracts/openapi/campusflow.yaml](../07-api/contracts/openapi/campusflow.yaml). La imagen de producción lo copia a `/app/openapi/campusflow.yaml` y lo publica en `/api/docs`. Sin ese archivo el proceso arranca igual y omite la documentación.
