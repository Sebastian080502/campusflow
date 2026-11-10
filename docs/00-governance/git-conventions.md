# Convenciones de Git

## Ramas

`main` es la rama desplegable. El cambio nuevo sale de `main` en una rama corta (`feat/`, `fix/`, `refactor/`, `chore/`), con un commit por cambio, y entra por pull request. GitHub debe rechazar el push directo a `main`. La historia de `main` no se reescribe.

No hay force push. No se usa `--no-verify`. No se cambia la configuración de Git del entorno.

## Commits

Conventional Commits, en inglés, modo imperativo, centrados en el porqué:

- `docs: define governance and request workflow`
- `feat: add request status policy and API`
- `feat: add role-based web client`
- `test: cover request transitions and critical API flow`
- `ci: verify build and living documentation`

Cada commit debe ser un slice coherente. No se mezclan archivos a medias ni secretos (`.env`, contraseñas reales, JWT reales).

## Repositorio

El remoto es `https://github.com/Sebastian080502/campusflow`. `dev` se publica con push normal. La primera publicación de una rama usa `-u`.
