# Hechos de dominio

CampusFlow no publica eventos en un bus. Cada hecho se guarda en la tabla `RequestHistory`, en la misma transacción que el cambio.

| Tipo | Cuándo se escribe | Qué guarda |
| --- | --- | --- |
| CREATED | Al registrar la solicitud | Estado destino `PENDING` y la nota "Solicitud registrada." |
| ASSIGNED | Al cambiar el responsable | Nota con el nombre de la persona asignada |
| STATUS_CHANGED | Al pasar de un estado a otro | Estado origen, estado destino y una nota en español |
| COMMENTED | Al publicar un comentario | Nota "Se agregó un comentario." El texto vive en `RequestComment` |

El historial es la auditoría que ve el usuario en el detalle. Orden cronológico ascendente. El actor es siempre un usuario autenticado.
