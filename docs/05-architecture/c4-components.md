# C4 — Componentes de la API

```mermaid
flowchart TB
  subgraph transversales [Transversales]
    guard[JwtAuthGuard]
    roles[RolesGuard]
    filter[ApiExceptionFilter]
    config[AppConfigModule]
    pipe[ValidationPipe]
  end
  policy[request-policy]
  authC[AuthController] --> authS[AuthService]
  authS --> strategy[JwtStrategy]
  usersC[UsersController] --> usersS[UsersService]
  catC[CategoriesController] --> catS[CategoriesService]
  reqC[RequestsController] --> reqS[RequestsService]
  reqS --> repo[RequestsRepository]
  health[HealthController]
  authS --> policy
  reqS --> policy
  usersS --> prisma[PrismaService]
  catS --> prisma
  repo --> prisma
  health --> prisma
```

`request-policy` queda en el centro: autorización y máquina de estados no pasan por Prisma. `RequestsRepository` está entre `RequestsService` y Prisma. `ApiExceptionFilter` traduce `P2002` a 409 y `P2025` a 404. `JwtAuthGuard`, `RolesGuard`, `ValidationPipe` y `AppConfigModule` cruzan todos los módulos.
