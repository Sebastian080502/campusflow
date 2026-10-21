# Ficha: cliente web

- SPA React y Vite.
- Sesión en `sessionStorage` bajo la clave `campusflow.token`.
- Rutas en español: `/login`, `/registro`, `/`, `/solicitudes`, `/solicitudes/nueva`, `/solicitudes/:id`, `/usuarios`, `/categorias`.
- El estudiante no ve usuarios ni categorías de administración.
- En desarrollo, Vite escucha en `::` puerto 5173 y proxya `/api` a `http://127.0.0.1:3000`.
- En la imagen Docker, Nginx 1.27 sirve el build, reenvía `/api/` al servicio `api` con `X-Real-IP`, `X-Forwarded-For` y `X-Forwarded-Proto`, comprime JS y CSS, y deja caché larga en `/assets/`. La imagen tiene healthcheck.
