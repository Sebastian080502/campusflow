# CampusFlow

Aplicación web para registrar y seguir solicitudes universitarias en un solo lugar.

## Problema

Los pedidos académicos, administrativos, tecnológicos y de infraestructura se dispersan en correos y formatos. Falta un estado visible, un responsable y un historial.

## Participante

| Participante | Rol |
| --- | --- |
| Juan Sebastián Osorio Fierro | Analista, Arquitecto y Desarrollador |

## Qué hace

El estudiante crea una solicitud y consulta solo las suyas. El personal encargado la asigna y la atiende. El administrador gestiona usuarios y categorías. Los estados van de Pendiente a Cerrada, con historial en cada cambio.

## Estado

Incremento funcional del monolito: API NestJS, cliente React y PostgreSQL. La documentación está en [docs/README.md](docs/README.md).

## Cómo ejecutarlo

1. Copia `.env.development.example` a `backend/.env` y cambia los placeholders. `JWT_SECRET` necesita al menos 32 caracteres.
2. Levanta PostgreSQL (`docker compose up db`) y, en `backend`, ejecuta `npx prisma migrate deploy` y `npm run start:dev`.
3. En `frontend`, ejecuta `npm install` y `npm run dev`. Abre `http://localhost:5173`.

`SEED_ON_START=true` solo en desarrollo local.

## Ramas

| Rama | Ambiente |
| --- | --- |
| `dev` | Desarrollo. Aquí entra el trabajo nuevo. |
| `qa` | Aseguramiento. Destino de promoción cuando el incremento compila y pasa las pruebas unitarias. |
| `main` | Producción. No se reescribe su historia. |

Pruebas: `npm test` en la raíz, o por separado en `backend` y `frontend`.
