#!/usr/bin/env bash
set -euo pipefail

# Dev setup script para DocGus-Agenda
# Este script crea un virtualenv, instala dependencias Python,
# aplica migraciones (si existen) y opcionalmente inicia el backend.
# Requiere: bash, python3 (idealmente 3.10/3.11), npm (para frontend manual)

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
VENV_DIR="$ROOT_DIR/.venv"

echo "[docgus] Directorio del proyecto: $ROOT_DIR"

find_python() {
  for py in python3.11 python3.10 python3.9 python3; do
    if command -v "$py" >/dev/null 2>&1; then
      echo "$py"
      return 0
    fi
  done
  return 1
}

PYTHON_BIN=$(find_python || true)
if [ -z "$PYTHON_BIN" ]; then
  echo "Error: No se encontró un intérprete Python adecuado (se buscó python3.11, python3.10, python3.9, python3)." >&2
  echo "Instala Python 3.10+ y vuelve a intentarlo." >&2
  exit 1
fi

echo "Usando intérprete: $PYTHON_BIN"

if [ ! -d "$VENV_DIR" ]; then
  echo "Creando virtualenv en $VENV_DIR..."
  "$PYTHON_BIN" -m venv "$VENV_DIR"
fi

echo "Activando virtualenv..."
# shellcheck disable=SC1090
source "$VENV_DIR/bin/activate"

echo "Actualizando pip..."
pip install --upgrade pip setuptools wheel

echo "Instalando dependencias Python (requirements.txt)..."
pip install -r requirements.txt || {
  echo "Instalación de dependencias falló. Recomendado: revisar salida e instalar dependencias faltantes manualmente." >&2
  exit 1
}

echo "Configurando variables de entorno temporales para desarrollo (sólo para esta sesión)..."
export FLASK_APP=src/app.py
export FLASK_DEBUG=1
export JWT_SECRET_KEY=${JWT_SECRET_KEY:-dev-secret-key}

echo "Preparando migraciones (si aplica)..."
if [ -d "$ROOT_DIR/migrations" ]; then
  if command -v flask >/dev/null 2>&1; then
    echo "Aplicando migraciones Alembic..."
    flask db upgrade || echo "Advertencia: flask db upgrade devolvió error; revisa las migraciones.";
  else
    echo "Advertencia: comando 'flask' no disponible en el entorno. Asegúrate de activar el virtualenv y tener Flask instalado.";
  fi
else
  echo "No se encontró carpeta 'migrations'; omitiendo paso de migraciones.";
fi

echo "Hecho. Opciones disponibles ahora:
  1) Iniciar backend en primer plano:
       source .venv/bin/activate && python3 src/app.py
  2) Iniciar backend en background (ejemplo):
       source .venv/bin/activate && nohup python3 src/app.py &>/tmp/docgus-backend.log &
  3) Iniciar frontend (en otra terminal):
       npm install
       VITE_BACKEND_URL=http://localhost:3001 npm run dev

Notas:
  - Para que Vite (frontend) consuma la API correctamente, crea un archivo .env en la raíz del frontend con:
      VITE_BACKEND_URL=http://localhost:3001
  - Este script prepara un entorno de desarrollo (MVP). Para producción debes:
      * Establecer un JWT_SECRET_KEY seguro
      * Usar una base de datos persistente (Postgres)
      * Revisar y fijar versiones de dependencias compatibles
"

echo "Si quieres que inicie el backend ahora, ejecuta: source .venv/bin/activate && python3 src/app.py"

exit 0
