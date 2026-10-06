# Reglas de seguridad

## Secretos

- Las contraseñas, `JWT_SECRET` y la URL de base de datos llegan solo por variables de entorno.
- Los archivos `.env.development.example`, `.env.qa.example` y `.env.production.example` usan placeholders (`change-me`, hosts de ejemplo). No son credenciales.
- `backend/.env` está ignorado por Git. Quien clona el repo copia el ejemplo y sustituye los valores.
- `SEED_ON_START=true` solo en desarrollo local. En QA y producción queda en `false`.
- La contraseña de PostgreSQL en Docker Compose se lee de `${POSTGRES_PASSWORD}`. No se fija un secreto dentro de `docker-compose.yml`.
- Si la integración continua necesita una base de datos, la contraseña es un valor efímero del job, documentado como tal, y no se reutiliza fuera del workflow.

## Arranque

La API no arranca si `JWT_SECRET` tiene menos de 32 caracteres, ni si `DATABASE_URL` no es PostgreSQL.

## Contraseñas de personas

- Se almacenan con bcrypt, costo 12. Nunca se devuelven en JSON.
- El registro público crea solo el rol `USER`.
- `STAFF` y `ADMIN` salen del seed local o del alta que hace un administrador.
- Una cuenta inactiva no puede iniciar sesión.

## Sesión y autorización

- El cliente envía `Authorization: Bearer`.
- El token dura 8 horas y solo contiene el identificador del usuario (`sub`).
- Cada consulta de solicitudes filtra en el servidor: el estudiante ve las suyas; personal y administración ven todas.
- Los estados `CLOSED` y `CANCELLED` no aceptan comentarios ni reasignación.

## Datos de demostración

Los correos `admin@campusflow.local`, `personal@campusflow.local` y `estudiante@campusflow.local` son cuentas de semilla local. Sus contraseñas no viven en el código: salen de `SEED_*_PASSWORD`.
