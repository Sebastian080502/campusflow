# Runbook

## La API no arranca

- Si el mensaje pide `JWT_SECRET`, el valor tiene menos de 32 caracteres.
- Si el mensaje pide PostgreSQL, `DATABASE_URL` no empieza por `postgresql://` o `postgres://`.
- Si falla la conexión, revisa que el contenedor `db` esté sano y que `migrate` haya terminado con código 0: `docker compose ps`.

## Semilla

`npm run seed` en `backend` carga categorías y las cuentas cuyas variables `SEED_*_PASSWORD` existan. `SEED_ON_START=true` solo en el ejemplo de desarrollo. Producción no define esa variable. Una contraseña de semilla de menos de 8 caracteres detiene el arranque cuando la semilla sí corre.

## Solicitud atascada

Revisa el historial en el detalle. `CLOSED` y `CANCELLED` no aceptan más cambios. Una resuelta se reabre a En proceso solo por el responsable o un administrador.

## Salud

`GET /api/health` ejecuta `SELECT 1` y responde `{ "status": "ok", "db": "ok", "version": "<APP_VERSION>" }`. Si la consulta falla, la API responde 503. Un 500 ya no significa «la base no responde». El cuerpo no incluye secretos.

Con la base detenida: `docker compose stop db` y luego `curl -s -o /dev/null -w "%{http_code}" http://127.0.0.1:3000/api/health` debe imprimir `503`.

## Apagado

`docker compose stop api` debe terminar en menos de dos segundos. El proceso recibe `SIGTERM` porque el contenedor arranca con `node dist/main.js` y la aplicación tiene los ganchos de cierre activos.

## Producción en la EC2

1. Instala Docker en la instancia t3.micro.
2. Crea `~/campusflow/.env` a partir de `.env.production.example`. Sustituye los placeholders en la máquina. No lo subas al repositorio y no pongas `APP_VERSION` ni `SEED_ON_START`.
3. Abre solo el puerto 80. La API y PostgreSQL no se publican.
4. Configura en GitHub los secretos `EC2_HOST` y `EC2_SSH_KEY`. `EC2_USER` es opcional y, si falta, el workflow usa `ubuntu`.
5. Un merge a `main` publica las imágenes y ejecuta `docker compose -f compose.prod.yml up -d --wait`.

Los logs de producción rotan a 10 MB para no llenar el disco de 8 GB.

## Secretos

Rota `JWT_SECRET` fuera del repositorio. Los ejemplos versionados son placeholders. La contraseña de Postgres en Compose es `${POSTGRES_PASSWORD}`.
