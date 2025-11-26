# Docker Compose — levantar el entorno de desarrollo

Se añadió `docker-compose.yml` y `Dockerfile.backend` para levantar un entorno local con Postgres, backend (Flask) y frontend (Vite).

Instrucciones rápidas:

1. Asegúrate de tener Docker y docker-compose instalados.

2. Construir y levantar los servicios:

```bash
docker-compose up --build
```

3. Servicios:
- Backend: http://localhost:3001
- Frontend (Vite): http://localhost:5173
- Postgres: puerto 5432

Notas:
- El backend monta el código del host en `/app`, de modo que los cambios se reflejan sin reconstruir la imagen.
- Si necesitas aplicar migraciones manualmente dentro del contenedor backend:

```bash
# Abrir una shell en el contenedor backend
docker-compose exec backend bash
# Dentro del contenedor
export FLASK_APP=src/app.py
flask db upgrade || echo "falló upgrade; revisa migraciones"
```

Seguridad y producción:
- No uses `JWT_SECRET_KEY=dev-secret-key` en producción.
- Usa imágenes y versiones de dependencias estables y revisa la configuración de volúmenes/puertos.
