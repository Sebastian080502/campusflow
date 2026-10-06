# Requisitos no funcionales

| ID | Requisito | Medida |
| --- | --- | --- |
| NFR-01 | Secreto de sesión | La API no arranca si `JWT_SECRET` tiene menos de 32 caracteres. |
| NFR-02 | Contraseñas | bcrypt con costo 12. El JSON de usuario no incluye `passwordHash`. Longitud de 8 a 72 caracteres. |
| NFR-03 | Autorización | Toda consulta de solicitudes filtra en el servidor. El estudiante no recibe solicitudes ajenas. |
| NFR-04 | Sesión | El token expira a las 8 horas y solo contiene `sub`. |
| NFR-05 | Validación | Título 5–120, descripción 10–4000, comentario 1–1000, nombre de categoría 3–80. |
| NFR-06 | Listado | La bandeja pagina de 1 a 100 elementos. El valor por defecto es 20. |
| NFR-07 | Salud | `GET /api/health` responde `{ "status": "ok" }` si PostgreSQL acepta `SELECT 1`. |
| NFR-08 | Secretos | Ningún secreto real se versiona. Los ejemplos usan placeholders. `SEED_ON_START=true` solo en desarrollo local. |
| NFR-09 | Idioma | Textos de interfaz, errores de negocio y documentación de producto en español. Identificadores de código en inglés. |
| NFR-10 | Cabeceras | La API envía Helmet y CORS limitado a `CORS_ORIGIN`. |
