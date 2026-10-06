# Matriz de trazabilidad

| Historia | Regla | API | Prueba |
| --- | --- | --- | --- |
| HU-01 | Registro crea USER | POST /api/auth/register | e2e de flujo crítico, si hay base `campusflow_test` |
| HU-02 | Login 200 sin hash | POST /api/auth/login | e2e rechaza clave inválida y acepta la válida |
| HU-03 | Visibilidad por solicitante | GET /api/requests | `canViewRequest` en request-policy.spec |
| HU-04 | Alta en PENDING | POST /api/requests | RequestsService rechaza staff y categoría inválida |
| HU-05 | Asignar pasa a IN_REVIEW | PATCH /api/requests/:id | planRequestChange, asignación |
| HU-06 | IN_PROGRESS y RESOLVED | PATCH /api/requests/:id | planRequestChange, avance y reapertura |
| HU-07 | Cancelar solo el solicitante | PATCH /api/requests/:id | planRequestChange, cancelación |
| HU-08 | Terminal sin comentario | POST /api/requests/:id/comments | canComment y describeCapabilities |
| HU-09 | Admin de usuarios y categorías | /api/users, /api/categories | e2e: staff recibe 403 al crear categoría |
| NFR-01 | JWT mínimo 32 | arranque | readAppEnv |
| NFR-02 | bcrypt 12 | users/password.ts | revisión de código; el hash no sale en login |
