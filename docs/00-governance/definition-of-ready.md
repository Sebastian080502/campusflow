# Definición de listo

Una historia puede construirse cuando se cumplen todos estos puntos:

1. Está escrita como `Como / Quiero / Para` y tiene al menos un escenario Gherkin comprobable.
2. Indica el rol que actúa: estudiante (`USER`), personal encargado (`STAFF`) o administrador (`ADMIN`).
3. Nombra los datos de entrada, las reglas de validación y el resultado visible.
4. Declara qué estados de la solicitud intervienen, si la historia cambia el flujo.
5. Identifica si requiere persistencia, autorización en el servidor o solo presentación.
6. Tiene un criterio de prueba: unitaria, de API o de recorrido en la interfaz.
7. No introduce un canal móvil, un segundo servicio desplegable ni un bus de mensajes.
8. Los secretos que necesite están descritos como variables de entorno, nunca como valores reales en el repositorio.

Si falta el rol, el estado destino o la regla de autorización, la historia vuelve a requisitos antes de escribir código.
