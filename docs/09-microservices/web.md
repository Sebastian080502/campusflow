# Ficha: cliente web

- SPA React y Vite.
- Sesión en `sessionStorage` bajo la clave `campusflow.token`.
- Rutas en español: `/login`, `/registro`, `/`, `/solicitudes`, `/solicitudes/nueva`, `/solicitudes/:id`, `/usuarios`, `/categorias`.
- El estudiante no ve usuarios ni categorías de administración.
- En desarrollo, Vite proxya `/api` a `http://localhost:3000`.
- En la imagen Docker, Nginx sirve el build y reenvía `/api/` al servicio `api`.
