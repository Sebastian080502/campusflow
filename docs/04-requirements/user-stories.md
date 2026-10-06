# Historias de usuario

## HU-01 Registro de estudiante

Como estudiante, quiero crear una cuenta con mi nombre, correo y contraseña, para registrar solicitudes sin que me asignen un rol de personal.

```gherkin
Escenario: registro publico crea USER
  Dado que el correo no existe
  Cuando envio POST /api/auth/register con una contrasena de al menos 8 caracteres
  Entonces la respuesta incluye un token y el rol USER
```

## HU-02 Ingreso

Como usuario activo, quiero iniciar sesión, para obtener un token de 8 horas.

```gherkin
Escenario: credenciales validas
  Dado un usuario activo
  Cuando envio POST /api/auth/login
  Entonces la respuesta es 200 y no incluye passwordHash
```

## HU-03 Mis solicitudes

Como estudiante, quiero ver solo mis solicitudes, para no consultar las de otras personas.

```gherkin
Escenario: aislamiento
  Dado dos estudiantes con solicitudes distintas
  Cuando el primero consulta GET /api/requests
  Entonces el total solo cuenta las suyas
```

## HU-04 Crear solicitud

Como estudiante, quiero registrar título, descripción y categoría activa, para iniciar el seguimiento en Pendiente.

```gherkin
Escenario: categoria activa
  Dado una categoria activa
  Cuando el estudiante crea la solicitud
  Entonces el estado es PENDING y el historial tiene CREATED
```

## HU-05 Asignar responsable

Como personal encargado, quiero asignarme o asignar a otro responsable activo, para que la solicitud pase a En revisión.

```gherkin
Escenario: asignacion desde pendiente
  Dado una solicitud PENDING
  Cuando un STAFF asigna un responsable activo
  Entonces el estado es IN_REVIEW y el historial registra ASSIGNED y STATUS_CHANGED
```

## HU-06 Atender

Como responsable o administrador, quiero pasar la solicitud a En proceso y luego a Resuelta, para dejar evidencia del avance.

```gherkin
Escenario: avance del responsable
  Dado una solicitud IN_REVIEW asignada a mi
  Cuando envio IN_PROGRESS y despues RESOLVED
  Entonces ambos cambios quedan en el historial
```

## HU-07 Cancelar

Como solicitante, quiero cancelar mientras está Pendiente o En revisión, para retirar un pedido que ya no necesito.

```gherkin
Escenario: solo el solicitante cancela
  Dado una solicitud PENDING
  Cuando el solicitante envia CANCELLED
  Entonces el estado es CANCELLED
  Y un miembro del personal recibe 403 si intenta cancelarla
```

## HU-08 Comentar y cerrar

Como participante autorizado, quiero comentar mientras la solicitud sigue abierta y cerrarla al quedar resuelta, para terminar el ciclo.

```gherkin
Escenario: terminal sin comentarios
  Dado una solicitud CLOSED o CANCELLED
  Cuando intento comentar o reasignar
  Entonces el servidor rechaza la accion
```

## HU-09 Administrar usuarios y categorías

Como administrador, quiero crear personal, cambiar roles y activar o desactivar categorías, para mantener el catálogo.

```gherkin
Escenario: personal no administra categorias
  Dado un usuario STAFF
  Cuando envia POST /api/categories
  Entonces la respuesta es 403
```
