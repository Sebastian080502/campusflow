# Sistema visual

La interfaz es una consola de operaciones del campus: lienzo gris frío, superficies blancas y un solo verde institucional. El estilo vive en `frontend/src/styles.css`. La marca y los iconos están en `frontend/src/components/Icons.tsx`.

Tipografía: Manrope en toda la aplicación. IBM Plex Mono solo en los códigos `CF-`. No hay serif en títulos.

Tokens: fondo `#f3f5f7`, superficie `#ffffff`, tinta `#1c2128`, texto secundario `#5c6770`, borde `#e3e7ec`, primario `#0f6e56`. Radio de 8px en controles y 12px en paneles. El verde se usa en la marca, el ítem activo del menú, el botón principal y los estados activos. Los estados de solicitud son insignias suaves (ámbar, azul, verde, gris, rojo) con un punto.

El cascarón es una barra lateral compacta (Inicio, Expedientes y, para el administrador, Personas y Oficios) más una barra superior con el contexto y la persona en sesión. En pantallas estrechas la barra se convierte en un cajón. El acceso y el registro son una tarjeta centrada, sin la barra lateral. El ojo de la contraseña vive dentro del campo.

Los listados son tablas o filas dentro de un panel. Los formularios de alta se abren junto al título de la página y no ocupan todo el ancho. La confirmación de un cambio de estado queda en la misma ficha.

Cada expediente muestra el código `CF-` y, debajo, el identificador interno. La descripción tiene su propio bloque. El recorrido marca el estado actual y la trazabilidad nombra a la persona, el momento y el cambio. El acceso incluye recuperación de contraseña y un enlace a la documentación de la API en `/api/docs`.

Los errores usan `role="alert"`. En móvil las tablas se leen con `data-label`. Si el sistema pide menos movimiento, las transiciones se apagan.
