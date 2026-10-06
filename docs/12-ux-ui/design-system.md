# Sistema visual

La interfaz es una aplicación de una sola página en español. No usa una librería de componentes: el estilo vive en `frontend/src/styles.css` y las ilustraciones son SVG propios en `frontend/src/components/CampusArt.tsx`.

La paleta combina papel cálido (`#efe7d8`) con verde profundo (`#0e6b52` y `#10211c`). El dibujo del campus —aulas, torre y un sendero— aparece en el acceso, el panel y la creación de una solicitud. El sendero representa el recorrido: Pendiente, En revisión, En proceso, Resuelta y Cerrada. Cancelada queda fuera de ese camino.

Los títulos usan Fraunces y el texto Outfit, con Segoe UI como respaldo. Los estados son insignias y, en el detalle, un paso a paso que marca el estado actual. Cada tarjeta del panel explica qué significa ese estado y abre el listado filtrado. El menú lateral marca la ruta activa y acompaña cada enlace con un icono.

Las contraseñas de acceso, registro y alta de usuarios tienen un botón Mostrar / Ocultar (`aria-pressed`). Categorías y usuarios se activan con un interruptor (`aria-pressed`). Las categorías conocidas muestran un icono según su nombre.

Los errores usan `role="alert"`. En pantallas estrechas el menú se apila arriba, la ilustración grande del acceso se oculta y queda una versión compacta dentro del formulario. Las tablas se leen con `data-label`. Si el sistema pide menos movimiento, las transiciones se apagan.
