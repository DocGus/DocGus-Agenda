# DocGus Agenda Digital Avanzada

## Planeamiento y Alcance

Este proyecto busca crear una agenda digital avanzada orientada a la gestión de metas y actividades, combinando:

- Tablas de actividades “palomeables” (checkboxes) diarias, semanales, mensuales y configurables.
- Integración con un calendario gráfico (tipo Google Calendar) con funcionalidades de checklists y seguimiento de progreso.
- Gestión de grupos para actividades y metas.
- Notas rápidas tipo Google Keep.
- Herramientas de productividad: mapas mentales, cronómetro, reloj de arena, etc.
- Escalabilidad para integrar agenda de profesionales de salud en futuras etapas.

### Alcance Inicial (MVP)

- Home page funcional y atractiva.
- Vista de agenda con tabla de actividades “palomeables” para el día actual.
- Sección de notas rápidas simple.
- Estructura de navegación para futuras secciones.
- Documentación inicial clara en README y archivos de planeamiento.

# WebApp boilerplate with React JS and Flask API

Build web applications using React.js for the front end and python/flask for your backend API.

- Documentation can be found here: https://4geeks.com/docs/start/react-flask-template
- Here is a video on [how to use this template](https://www.loom.com/share/f37c6838b3f1496c95111e515e83dd9b)
- Integrated with Pipenv for package managing.
- Fast deployment to Render [in just a few steps here](https://4geeks.com/docs/start/deploy-to-render-com).
- Use of .env file.
- SQLAlchemy integration for database abstraction.

### 1) Installation:

> If you use Github Codespaces (recommended) or Gitpod this template will already come with Python, Node and the Posgres Database installed. If you are working locally make sure to install Python 3.10, Node

It is recomended to install the backend first, make sure you have Python 3.10, Pipenv and a database engine (Posgress recomended)

1. Install the python packages: `$ pipenv install`
2. Create a .env file based on the .env.example: `$ cp .env.example .env`
3. Install your database engine and create your database, depending on your database you have to create a DATABASE_URL variable with one of the possible values, make sure you replace the valudes with your database information:

| Engine    | DATABASE_URL                                        |
| --------- | --------------------------------------------------- |
| SQLite    | sqlite:////test.db                                  |
| MySQL     | mysql://username:password@localhost:port/example    |
| Postgress | postgres://username:password@localhost:5432/example |

4. Migrate the migrations: `$ pipenv run migrate` (skip if you have not made changes to the models on the `./src/api/models.py`)
5. Run the migrations: `$ pipenv run upgrade`
6. Run the application: `$ pipenv run start`

## First run — Quickstart (rápido)

Sigue estos pasos mínimos para que cualquier colaborador arranque el proyecto localmente.

1. Clona el repositorio y sitúate en la rama principal:

```bash
git clone <repo-url>
cd DocGus-Agenda
git checkout main
git pull origin main
```

2. Backend — dependencias y variables de entorno:

```bash
# Opción A (Pipenv, recomendado si usas Pipfile)
pipenv install
cp .env.example .env
# Edita .env y configura las variables necesarias. Para desarrollo con Vite puedes dejar
# VITE_BACKEND_URL vacío para usar rutas relativas y el proxy de Vite, o poner
# VITE_BACKEND_URL=http://localhost:3001 si prefieres acceso directo.
```

3. Base de datos y migraciones:

```bash
# Si usas Flask-Migrate/Alembic (recomendado):
pipenv run migrate   # (si has cambiado modelos)
pipenv run upgrade

# Alternativa rápida (solo en desarrollo): crear tablas automáticamente
# desde el contexto de Flask (útil si no quieres ejecutar alembic ahora):
PYTHONPATH=src python3 - <<'PY'
from app import app
from api.models import db
with app.app_context():
  db.create_all()
  print('db.create_all() executed')
PY
```

4. Levantar servicios:

```bash
# Backend (dentro de Pipenv)
pipenv run start

# Frontend
npm ci
# Usar vite en modo dev; la opción --host permite accesos desde otra máquina si usas Codespaces
npm run dev -- --host
```

5. Probar localmente:

```bash
# Backend: comprobar endpoint
curl -v http://127.0.0.1:3001/api/ || true

# Frontend: abrir la URL que Vite muestre (ej: http://localhost:3000)
```

6. Tests (opcional pero recomendado):

```bash
# Backend
pytest

# Frontend
npm test
```

Notas rápidas:
- Mantén `main` en estado desplegable: abre PRs pequeños y ejecuta tests en CI antes de mergear.
- Si trabajas en un devcontainer/Codespace, ajusta `VITE_BACKEND_URL` si el backend está fuera del contenedor (por ejemplo `host.docker.internal:3001`).


> Note: Codespaces users can connect to psql by typing: `psql -h localhost -U gitpod example`

### Undo a migration

You are also able to undo a migration by running

```sh
$ pipenv run downgrade
```

### Backend Populate Table Users

To insert test users in the database execute the following command:

```sh
$ flask insert-test-users 5
```

And you will see the following message:

```
  Creating test users
  test_user1@test.com created.
  test_user2@test.com created.
  test_user3@test.com created.
  test_user4@test.com created.
  test_user5@test.com created.
  Users created successfully!
```

### **Important note for the database and the data inside it**

Every Github codespace environment will have **its own database**, so if you're working with more people eveyone will have a different database and different records inside it. This data **will be lost**, so don't spend too much time manually creating records for testing, instead, you can automate adding records to your database by editing `commands.py` file inside `/src/api` folder. Edit line 32 function `insert_test_data` to insert the data according to your model (use the function `insert_test_users` above as an example). Then, all you need to do is run `pipenv run insert-test-data`.

### Front-End Manual Installation:

- Make sure you are using node version 20 and that you have already successfully installed and runned the backend.

1. Install the packages: `$ npm install`
2. Start coding! start the webpack dev server `$ npm run start`

## Publish your website!

This boilerplate it's 100% read to deploy with Render.com and Heroku in a matter of minutes. Please read the [official documentation about it](https://4geeks.com/docs/start/deploy-to-render-com).

### Contributors

This template was built as part of the 4Geeks Academy [Coding Bootcamp](https://4geeksacademy.com/us/coding-bootcamp) by [Alejandro Sanchez](https://twitter.com/alesanchezr) and many other contributors. Find out more about our [Full Stack Developer Course](https://4geeksacademy.com/us/coding-bootcamps/part-time-full-stack-developer), and [Data Science Bootcamp](https://4geeksacademy.com/us/coding-bootcamps/datascience-machine-learning).

You can find other templates and resources like this at the [school github page](https://github.com/4geeksacademy/).
