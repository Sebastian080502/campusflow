# Definición de hecho

Una historia está hecha cuando:

1. El comportamiento acordado funciona en la API y, si tiene interfaz, en el cliente web.
2. La autorización se comprueba en el servidor. Ocultar un botón no sustituye esa comprobación.
3. Las pruebas unitarias del dominio o del módulo afectado pasan.
4. La API y el cliente compilan (`npm run build` en `backend` y en `frontend`).
5. La documentación mapeada en `.living-docs.json` se actualizó en el mismo cambio.
6. No se añadieron secretos, contraseñas reales ni `.env` locales.
7. El cambio está en la rama `dev` con un mensaje Conventional Commits en inglés.
8. Los estados terminales (`CLOSED`, `CANCELLED`) siguen sin aceptar comentarios ni reasignación.

La promoción a `qa` exige que el incremento compile y que las pruebas unitarias pasen. La promoción a `main` exige además que el proyecto construya. Si las pruebas de extremo a extremo no pueden ejecutarse porque PostgreSQL no está disponible, `main` no recibe ese incremento.
