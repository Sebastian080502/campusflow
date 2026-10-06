# Riesgos

| Riesgo | Impacto | Mitigación |
| --- | --- | --- |
| PostgreSQL o Docker no disponibles | No corren las pruebas e2e ni la demo con datos | Las unitarias no necesitan base. `main` no se promueve si e2e no pudo correr. |
| Secreto corto o commiteado | La API no arranca, o queda una credencial en Git | Mínimo 32 caracteres. `.env` ignorado. Ejemplos con placeholders. |
| Estudiante ve solicitudes ajenas | Fuga de datos académicos | El filtro está en el servidor, cubierto por `canViewRequest`. |
| Estado terminal editable | Se reabre un caso cerrado sin regla | La política rechaza comentarios y reasignación. |
| Semilla en producción | Cuentas de demostración en el ambiente real | `SEED_ON_START=true` solo en el ejemplo de desarrollo. |
| Un solo responsable del proyecto | El conocimiento queda en una persona | Documentación en `docs/` y guion de demo de 16 pasos. |
