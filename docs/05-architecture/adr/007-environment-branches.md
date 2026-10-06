# ADR 007 — Ramas de ambiente

## Estado

Aceptada.

## Decisión

| Rama | Ambiente |
| --- | --- |
| dev | Desarrollo. Recibe todo el trabajo nuevo. |
| qa | Aseguramiento. Promoción del incremento que compila y pasa pruebas unitarias. |
| main | Producción. Solo recibe lo verificado. Su historia no se reescribe. |

`SEED_ON_START` es `true` solo en el ejemplo de desarrollo local. QA y producción lo dejan en `false`. Los ejemplos de entorno usan hosts y secretos de marcador, distintos por ambiente.

## Consecuencias

Un incremento sin pruebas de extremo a extremo, si PostgreSQL no está disponible, puede llegar a `qa` y no a `main`.
