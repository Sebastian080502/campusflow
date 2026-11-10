# Mapa de dominio

El dominio gira en torno a la solicitud universitaria y a quién puede moverla.

```mermaid
flowchart LR
  estudiante[Estudiante USER]
  personal[Personal STAFF]
  admin[Administrador ADMIN]
  solicitud[Solicitud]
  categoria[Categoria]
  historial[Historial persistido]
  estudiante -->|crea y consulta las suyas| solicitud
  personal -->|ve todas, asigna y atiende| solicitud
  admin -->|administra usuarios y categorias| solicitud
  solicitud --> categoria
  solicitud --> historial
```

Módulos del monolito:

- Identidad: registro, ingreso y sesión.
- Usuarios: roles y activación.
- Categorías: catálogo que clasifica solicitudes.
- Solicitudes: ciclo de atención, comentarios e historial.
- Política de estados: reglas puras, sin base de datos, en `backend/src/domain/request-policy.ts`.
