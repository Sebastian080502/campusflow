# Integración continua

El workflow `.github/workflows/ci.yml` corre en `dev`, `qa` y `main`, y en pull requests. Instala API y cliente, genera el cliente de Prisma, ejecuta las pruebas unitarias y construye ambos paquetes.

Las pruebas unitarias no necesitan PostgreSQL. La contraseña que pudiera aparecer en un job futuro de base es un valor efímero de ese job, no un secreto reutilizable, y no se documenta como credencial real.

`.github/workflows/living-docs.yml` comprueba que un cambio de API, cliente, datos o Docker actualice la documentación mapeada en `.living-docs.json`. La guía está en `docs/00-governance/documentation-rules.md`.

No hay despliegue automático a un servidor. Publicar a producción es fusionar `qa` en `main` después de la verificación.
