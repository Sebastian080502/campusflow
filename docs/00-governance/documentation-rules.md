# Reglas de documentación

La documentación de CampusFlow está en español, en `docs/`. Los identificadores de código y los mensajes de commit están en inglés.

## Documentación viva

`.living-docs.json` relaciona superficies de código con carpetas de documentación:

| Superficie | Si cambia el código, actualiza al menos |
| --- | --- |
| API (`backend/**`) | `docs/07-api`, `docs/09-microservices` o `docs/05-architecture` |
| Cliente (`frontend/**`) | `docs/12-ux-ui`, `docs/07-api` o `docs/14-training` |
| Datos (Prisma y migraciones) | `docs/06-data` o `docs/09-microservices` |
| DevOps (workflows, Docker) | `docs/10-devops` o `docs/13-operations` |

El script `scripts/check-living-docs.js` compara el rango de commits y falla si una superficie cambió sin contenido real en su documentación. Un checkbox vacío no cuenta.

## Qué se escribe

- Hechos del producto y de la implementación actual. No se dejan secciones con el texto "por definir".
- Diagramas Mermaid cuando aclaran contexto, contenedores, secuencia o datos.
- Contratos en `docs/07-api/contracts/openapi/campusflow.yaml`, alineados con los controladores.
- Decisiones cerradas como ADR en `docs/05-architecture/adr`.

## Qué no se escribe

- Secretos, contraseñas reales, cadenas JWT reales ni volcados de `.env`.
- Referencias a otros repositorios de método o a orquestación de agentes. CampusFlow se documenta solo.
- Placeholders del tipo "completar después". Si un tema no aplica, se dice por qué en una frase.

## Índice

El mapa de carpetas está en [../README.md](../README.md). El README de la raíz resume el producto y cómo ejecutarlo; no copia este árbol.
