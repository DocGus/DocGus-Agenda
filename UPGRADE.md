# UPGRADE notes — cambios principales hasta `estable_3`/`estable_4`

Este documento resume los cambios y pasos recomendados tras la modernización realizada.

Cambios clave:
- Frontend: actualizado a Vite 7.x, build ya generado en `dist/`.
- Backend:
  - Manejo de errores JSON para rutas `/api/*` (evita que el frontend reciba HTML de error).
  - Soporte para migraciones Alembic y comando `tools/seed_dev.py` para crear tablas y seed.
  - JWT: requerimiento para `JWT_SECRET_KEY` en entornos no de desarrollo.
  - CORS configurable mediante `CORS_ORIGINS`.
  - Rate limiting: integrado (`Flask-Limiter`) y límites simples en memoria para endpoints críticos (`/api/register`, `/api/login`) en desarrollo.
  - Validación básica de inputs para `register` y `login` y `MIN_PASSWORD_LEN` configurable.

Cómo actualizar desde una copia antigua:
1) Actualiza dependencias Python y Node:
   - `pipenv install --dev`
   - `npm ci`
2) Copia `.env.example` a `.env` y actualiza valores (especialmente `DATABASE_URL`, `JWT_SECRET_KEY`).
3) Si usas Docker, puedes usar `docker compose up -d` (ver `docker-compose.override.yml`).
4) Ejecuta migraciones y seed:
   - `pipenv run flask db upgrade`
   - `pipenv run python tools/seed_dev.py`
5) Inicia el backend: `pipenv run start` y el frontend si trabajas con Vite en dev: `VITE_BACKEND_URL=http://localhost:3001 npm run dev`.

Notas de compatibilidad:
- Algunos límites de rate limiting y longitudes de contraseña están configurados para compatibilidad con tests; ajusta `MIN_PASSWORD_LEN` y `RATELIMIT_DEFAULT` para producción.
- Revisa `README.es.md` para instrucciones detalladas sobre despliegue y variables de entorno.
