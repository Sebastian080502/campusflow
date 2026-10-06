# Modelo de datos

PostgreSQL. El esquema vive en `backend/prisma/schema.prisma`. La migración inicial es `backend/prisma/migrations/20261006152409_init`.

## User

Identificador `cuid`, correo único, `passwordHash`, `fullName`, `role` (`USER`, `STAFF`, `ADMIN`), `active`, fechas. Índice por rol y actividad.

## Category

Nombre único, descripción opcional, `active`.

## Request

Código único `CF-0001`, título, descripción, estado, categoría, solicitante y responsable opcional. Índices por estado, solicitante, responsable y categoría.

## RequestComment

Texto, autor y solicitud. Se borra en cascada con la solicitud.

## RequestHistory

Tipo `CREATED`, `STATUS_CHANGED`, `ASSIGNED` o `COMMENTED`. Estados origen y destino opcionales. Nota obligatoria. Actor y solicitud. Cascada al borrar la solicitud.

## RequestCounter

Fila única `id = 1` que incrementa el consecutivo del código.

Las contraseñas no se guardan en claro. El hash usa bcrypt con costo 12.
