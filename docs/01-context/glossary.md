# Glosario

| Término | Significado |
| --- | --- |
| Solicitud | Pedido universitario con código `CF-0001`, título, descripción, categoría, estado, solicitante y responsable opcional. |
| Solicitante | Usuario con rol `USER` que crea la solicitud. Solo él puede cancelarla, y solo desde Pendiente o En revisión. |
| Responsable | Usuario `STAFF` o `ADMIN` activo asignado a atender la solicitud. |
| Categoría | Clasificación de la solicitud. Si está inactiva, no acepta solicitudes nuevas. |
| Estado | Posición de la solicitud en la máquina: Pendiente, En revisión, En proceso, Resuelta, Cerrada o Cancelada. |
| Estado terminal | `CLOSED` o `CANCELLED`. No admite comentarios ni reasignación. |
| Historial | Registro persistido de creación, cambios de estado, asignaciones y comentarios. No es un bus de mensajes. |
| Comentario | Nota visible en la solicitud mientras no esté en un estado terminal. |
| Rol | `USER` (estudiante), `STAFF` (personal encargado) o `ADMIN` (administrador). |
| Código | Identificador legible y único, generado con un contador (`CF-0001`). |
| JWT | Token bearer de 8 horas. Solo lleva el identificador del usuario. |
| Semilla | Datos iniciales de categorías y, si hay contraseñas de entorno, cuentas de demostración. |
| Ambiente | `dev` (desarrollo), `qa` (aseguramiento) o `main` (producción). |
| Monolito modular | Una API y un cliente desplegados juntos, con módulos internos separados, sin servicios independientes. |
