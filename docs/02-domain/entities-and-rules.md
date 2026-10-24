# Entidades y reglas

## Usuario

- Correo único, nombre, hash de contraseña, rol y bandera `active`.
- El registro público fuerza el rol `USER`.
- `STAFF` y `ADMIN` se crean por semilla o por un administrador.
- Un administrador no puede desactivarse ni bajarse el rol a sí mismo.
- Una cuenta inactiva no inicia sesión.

## Categoría

- Nombre único. Semilla: Académica, Administrativa, Tecnológica, Infraestructura, Otra.
- Solo un administrador crea o edita categorías.
- Una categoría inactiva no acepta solicitudes nuevas. Las ya creadas siguen visibles.

## Solicitud

- La crea solo un estudiante, contra una categoría activa.
- Título de 5 a 120 caracteres. Descripción de 10 a 4000.
- Nace en `PENDING`, sin responsable, con código `CF-` y cuatro dígitos.
- El estudiante consulta solo las suyas. Personal y administración consultan todas.

## Transiciones

| Desde | Hacia | Quién |
| --- | --- | --- |
| PENDING | IN_REVIEW | Ocurre al asignar un responsable activo `STAFF` o `ADMIN` |
| PENDING o IN_REVIEW | CANCELLED | Solo el solicitante |
| IN_REVIEW | IN_PROGRESS | Responsable asignado o administrador |
| IN_PROGRESS | RESOLVED | Responsable asignado o administrador |
| RESOLVED | CLOSED | Solicitante, responsable o administrador |
| RESOLVED | IN_PROGRESS | Responsable o administrador (reapertura) |
| CLOSED, CANCELLED | ninguna | Estados terminales |

Asignar en `PENDING` deja la solicitud en `IN_REVIEW` y guarda dos hechos: asignación y cambio de estado. No se reasigna ni se comenta en estados terminales. El comentario admite de 1 a 1000 caracteres.
