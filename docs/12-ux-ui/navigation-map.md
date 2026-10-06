# Mapa de navegación

| Ruta | Quién entra | Qué hace |
| --- | --- | --- |
| /login | Público | Inicia sesión |
| /registro | Público | Crea cuenta de estudiante |
| / | Autenticado | Resumen por estado |
| /solicitudes | Autenticado | Bandeja. El estudiante ve "Mis solicitudes" |
| /solicitudes/nueva | USER | Formulario de alta |
| /solicitudes/:id | Autenticado, si puede verla | Detalle, acciones, comentarios e historial |
| /usuarios | ADMIN | Alta y edición de cuentas |
| /categorias | ADMIN | Alta y activación de categorías |

Quien no tiene el rol ve el aviso "Sin permiso". Cerrar sesión borra el token de la pestaña.
