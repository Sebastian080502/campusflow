# C4 — Contexto

```mermaid
flowchart TB
  estudiante[Estudiante]
  personal[Personal encargado]
  admin[Administrador]
  campusflow[CampusFlow]
  estudiante --> campusflow
  personal --> campusflow
  admin --> campusflow
```

Las tres personas usan el navegador. CampusFlow no se integra con otros sistemas de la universidad en este incremento.
