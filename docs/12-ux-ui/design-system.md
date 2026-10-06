# Sistema visual

La interfaz es una aplicación de una sola página en español. No usa una librería de componentes: el estilo vive en `frontend/src/styles.css`.

La paleta combina papel cálido (`#efe7d8`) con verde profundo (`#0e6b52` y `#10211c`). Las superficies son translúcidas y las tarjetas de estado del inicio enlazan al listado filtrado. El menú lateral marca la ruta activa con un recuadro claro.

Los títulos usan Fraunces y el texto Outfit, con Segoe UI como respaldo. Los estados siguen siendo insignias: Pendiente, En revisión, En proceso, Resuelta, Cerrada y Cancelada. Categorías y usuarios se activan con un interruptor (`aria-pressed`).

Los errores usan `role="alert"`. En pantallas estrechas el menú se apila arriba y las tablas se leen con `data-label`. Si el sistema pide menos movimiento, las transiciones se apagan.
