# Alcance

## Dentro del alcance

- Registro público que crea únicamente cuentas de estudiante.
- Alta y edición de personal y administradores desde la cuenta administradora.
- Categorías activas e inactivas. La semilla inicial trae Académica, Administrativa, Tecnológica, Infraestructura y Otra.
- Creación de solicitudes por el estudiante, con título, descripción y categoría activa.
- Bandeja filtrable. El estudiante ve solo las suyas. Personal y administración ven todas.
- Asignación de responsable, transición de estados, comentarios e historial persistido.
- Resumen por estado en el inicio.
- Salud de la API (`GET /api/health`).

## Fuera del alcance

- Aplicación móvil.
- Microservicios o un bus de eventos.
- Notificaciones por correo.
- Adjuntar archivos.
- Integración con el sistema de matrícula de la universidad.
- Recuperación de contraseña por correo.

Esas exclusiones mantienen el proyecto en un monolito modular entregable en el curso.
