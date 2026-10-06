# Arquitectura

CampusFlow es un monolito modular. Un proceso de API atiende el dominio y un cliente estático presenta las pantallas. PostgreSQL es el único almacén.

## Diagramas

- [Contexto C4](c4-context.md)
- [Contenedores C4](c4-containers.md)

## Decisiones

| ADR | Decisión |
| --- | --- |
| [001](adr/001-modular-monolith.md) | Monolito modular, sin microservicios ni móvil |
| [002](adr/002-stack.md) | TypeScript, NestJS, React, Vite, PostgreSQL, Prisma |
| [003](adr/003-jwt.md) | JWT bearer y bcrypt costo 12 |
| [004](adr/004-role-enum.md) | Roles USER, STAFF y ADMIN |
| [005](adr/005-status-machine.md) | Máquina de estados de la solicitud |
| [006](adr/006-language.md) | Español en producto, inglés en código |
| [007](adr/007-environment-branches.md) | Ramas dev, qa y main |
