# Gobierno del proyecto

CampusFlow es un proyecto académico individual de Arquitectura de Software. Estas reglas fijan cómo se decide, se documenta y se entrega el trabajo.

## Alcance del gobierno

- El participante Juan Sebastián Osorio Fierro actúa como analista, arquitecto y desarrollador.
- El producto es una aplicación web de solicitudes universitarias. No hay aplicación móvil.
- La implementación es un monolito modular: una API NestJS y un cliente React, con PostgreSQL.
- La documentación vive en `docs/` y se actualiza en el mismo cambio que modifica el comportamiento.

## Documentos de esta carpeta

| Documento | Para qué sirve |
| --- | --- |
| [definition-of-ready.md](definition-of-ready.md) | Qué debe estar claro antes de construir una historia |
| [definition-of-done.md](definition-of-done.md) | Qué debe cumplirse para dar una historia por terminada |
| [documentation-rules.md](documentation-rules.md) | Cómo se escribe y se mantiene la documentación viva |
| [git-conventions.md](git-conventions.md) | Ramas `dev`, `qa` y `main`, y Conventional Commits |
| [security-rules.md](security-rules.md) | Secretos, contraseñas, JWT y datos de personas |

Las decisiones de arquitectura cerradas se registran como ADR en [../05-architecture](../05-architecture/README.md).
