# ADR 008 — GitHub Flow

## Estado

Aceptada. Reemplaza el ADR 007.

## Decisión

`main` es la única rama desplegable. Cada cambio sale de `main` en una rama corta, entra por un pull request y un commit. El pull request es obligatorio y la integración continua tiene que estar en verde. No se publica a producción desde `dev` ni desde `qa`.

La protección de `main` (rechazar el push directo) se configura en GitHub. No vive en el repositorio y no se debilita la autenticación para conseguirla.

## Por qué

El ADR 007 separaba `dev`, `qa` y `main`. `main` seguía con el README inicial, así que un pipeline que despliega esa rama no publica la aplicación. Promover a mano entre ramas de ambiente deja la entrega fuera de la verificación automática.

## Consecuencias

Las pruebas de extremo a extremo corren en la integración continua contra un PostgreSQL efímero. Las imágenes se publican en GHCR solo desde `main`, y el despliegue a la EC2 usa esa misma confirmación. `SEED_ON_START` puede quedar en el ejemplo de desarrollo; producción no lo define.
