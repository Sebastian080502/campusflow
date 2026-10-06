# ADR 001 — Monolito modular

## Estado

Aceptada.

## Contexto

El curso pide una plataforma web de solicitudes. El equipo es una persona. Separar servicios añadiría red, despliegue y consistencia sin un problema de escala que lo justifique.

## Decisión

Una API NestJS con módulos de autenticación, usuarios, categorías y solicitudes, más un cliente React. La carpeta `docs/09-microservices` describe esos módulos. CampusFlow no es una arquitectura de microservicios.

## Consecuencias

Un despliegue, una base de datos y transacciones locales para el historial. Escalar más adelante exigiría un ADR nuevo.
