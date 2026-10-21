# Mapa de navegación

| Ruta | Quién entra | Qué hace |
| --- | --- | --- |
| /login | Público | Inicia sesión. Enlaza la documentación de la API en /api/docs |
| /registro | Público | Crea cuenta de estudiante |
| /recuperar | Público | Pide el código para restablecer la contraseña |
| /restablecer | Público | Define una contraseña nueva con ese código |
| / | Autenticado | Caso que requiere atención y conteo por estado |
| /solicitudes | Autenticado | Tabla de expedientes. El estudiante ve "Mis solicitudes" |
| /solicitudes/nueva | USER | Formulario de alta |
| /solicitudes/:id | Autenticado, si puede verla | Detalle, acciones, comentarios e historial |
| /usuarios | ADMIN | Alta y edición de cuentas |
| /categorias | ADMIN | Alta y activación de categorías |

Quien no tiene el rol ve el aviso "Sin permiso". Cerrar sesión borra el token de la pestaña.
