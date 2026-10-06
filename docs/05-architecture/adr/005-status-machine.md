# ADR 005 — Máquina de estados

## Estado

Aceptada.

## Decisión

`PENDING → IN_REVIEW` al asignar. Luego `IN_PROGRESS → RESOLVED → CLOSED`. `CANCELLED` solo la pide el solicitante desde `PENDING` o `IN_REVIEW`. `RESOLVED` puede volver a `IN_PROGRESS` por el responsable o un administrador. `CLOSED` y `CANCELLED` son terminales.

La política está en `request-policy.ts`, sin depender de Prisma. Los controladores traducen `DomainError` a 400, 403 o 409.

## Consecuencias

La interfaz muestra solo las acciones que `describeCapabilities` calcula para el actor. El servidor vuelve a evaluarlas en cada PATCH.
