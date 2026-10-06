# Estrategia de pruebas

## Unitarias

`npm test` en `backend` ejecuta la política de estados y el servicio de solicitudes sin base de datos. Cubren cancelación, asignación, reapertura, estados terminales y el rechazo cuando personal intenta crear una solicitud o la categoría no existe.

`npm test` en `frontend` comprueba las etiquetas en español y el lector de mensajes de error.

## Extremo a extremo

`npm run test:e2e` en `backend` exige que `DATABASE_URL` contenga el nombre `campusflow_test`. Si la base tiene otro nombre, el archivo de prueba aborta. El escenario recorre ingreso, alta, asignación, comentario, resolución y la prohibición de que personal cree categorías.

## Construcción

`npm run build` en cada paquete debe pasar antes de promover a `qa`. Promover a `main` pide además que las pruebas de extremo a extremo hayan podido ejecutarse.
