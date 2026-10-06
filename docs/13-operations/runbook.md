# Runbook

## La API no arranca

- Si el mensaje pide `JWT_SECRET`, el valor tiene menos de 32 caracteres.
- Si el mensaje pide PostgreSQL, `DATABASE_URL` no empieza por `postgresql://` o `postgres://`.
- Si falla la conexión, revisa que el contenedor `db` esté sano: `docker compose ps`.

## Semilla

`SEED_ON_START=true` solo en local. Si falta `SEED_ADMIN_PASSWORD` (o la de personal o estudiante), esa cuenta se omite y las categorías sí se crean. Una contraseña de semilla de menos de 8 caracteres detiene el arranque.

## Solicitud atascada

Revisa el historial en el detalle. `CLOSED` y `CANCELLED` no aceptan más cambios. Una resuelta se reabre a En proceso solo por el responsable o un administrador.

## Salud

`GET /api/health` ejecuta `SELECT 1`. Un 500 indica que la base no responde. El cuerpo de error no incluye secretos.

## Secretos

Rota `JWT_SECRET` fuera del repositorio. Los ejemplos versionados son placeholders. La contraseña de Postgres en Compose es `${POSTGRES_PASSWORD}`.
