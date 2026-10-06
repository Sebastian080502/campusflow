# ADR 004 — Enumeración de roles

## Estado

Aceptada.

## Decisión

Tres roles persistidos: `USER`, `STAFF`, `ADMIN`. El registro público solo crea `USER`. El dominio TypeScript usa la misma unión de cadenas y, al escribir en Prisma, se convierte al enum de la base.

## Consecuencias

No hay roles arbitrarios. Un cambio de rol es un PATCH de administrador sobre el usuario.
