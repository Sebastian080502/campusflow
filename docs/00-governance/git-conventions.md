# Convenciones de Git

## Ramas de ambiente

| Rama | Ambiente | Qué contiene |
| --- | --- | --- |
| `dev` | Desarrollo | Todo el trabajo nuevo. Es la única rama donde se integran incrementos en curso. |
| `qa` | Aseguramiento | Promoción del incremento de `dev` que ya compila y cuyas pruebas unitarias pasan. Es el objetivo de promoción antes de producción. |
| `main` | Producción | Solo incrementos verificados: pruebas unitarias en verde y build de API y cliente. No se reescribe su historia. |

`qa` nace desde `main` cuando todavía solo contiene el README inicial, y permanece como destino de promoción. El trabajo inacabado no se fusiona a `main`.

Flujo:

1. Crear el cambio en `dev`.
2. Cuando el slice compila y las pruebas unitarias pasan, fusionar `dev` en `qa` (fast-forward o merge) y publicar `qa`.
3. Fusionar `qa` en `main` solo si además el proyecto construye. Si las pruebas de extremo a extremo no pueden correr porque falta PostgreSQL, `main` se queda como está.

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
