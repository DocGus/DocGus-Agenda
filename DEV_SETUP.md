# Desarrollo local (MVP) — guía rápida

Este archivo documenta los pasos para levantar el proyecto en un entorno de desarrollo (MVP). Está pensado para pruebas locales rápidas: registro, login y comprobación de rutas protegidas.

Archivos añadidos:

- `dev_setup.sh`: script automático en la raíz que crea un virtualenv, instala dependencias Python y aplica migraciones si existen.

Requisitos recomendados:

- Python 3.10 o 3.11 (si tienes varias versiones, el script detecta `python3.11`, `python3.10`, `python3.9`, `python3` en ese orden).
- Node.js + npm (para el frontend).

1) Uso del script `dev_setup.sh`

```bash
chmod +x dev_setup.sh    # (una sola vez)
./dev_setup.sh
```

El script realizará:

- Crear `.venv` (si no existe) usando el intérprete Python disponible.
- Activar el virtualenv e instalar `requirements.txt`.
- Exportar variables temporales para desarrollo: `FLASK_APP=src/app.py`, `FLASK_DEBUG=1`, `JWT_SECRET_KEY` (usa `dev-secret-key` si no la defines).
- Intentar aplicar migraciones con `flask db upgrade` si existe la carpeta `migrations`.

2) Iniciar servicios (manual)

- Backend (desde la raíz, dentro del virtualenv):

```bash
source .venv/bin/activate
python3 src/app.py
# Backend por defecto escucha en http://0.0.0.0:3001
```

- Frontend (otra terminal):

```bash
npm install
export VITE_BACKEND_URL=http://localhost:3001
npm run dev
```

3) Variables de entorno importantes (desarrollo)

- `JWT_SECRET_KEY` — clave secreta JWT (no la incluyas en el repo). En desarrollo el script usa `dev-secret-key` si no defines una.
- `DATABASE_URL` — URL a la BD. Si no la defines, el backend usa SQLite por defecto.

4) Pruebas rápidas con curl

```bash
# Registrar
curl -i -X POST http://127.0.0.1:3001/api/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!","role":"admin"}'

# Login
curl -s -X POST http://127.0.0.1:3001/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123!" }' | jq

# Probar endpoint protegido (reemplaza <TOKEN>)
curl -s -H "Authorization: Bearer <TOKEN>" http://127.0.0.1:3001/api/private | jq
```

5) Notas para producción (resumen)

- No uses `dev-secret-key` en producción. Define `JWT_SECRET_KEY` seguro.
- Usa una base de datos persistente (Postgres) con `DATABASE_URL` correctamente configurada.
- Considera crear un `docker-compose.yml` para estandarizar despliegue y pruebas.

Si quieres, puedo añadir un `docker-compose.yml` y un `Makefile` para estandarizar el flujo de desarrollo.
