Resumen:

- Bump `sqlalchemy` to `>=2.0,<3.0` and `Flask-SQLAlchemy` to `>=3.0,<4.0` in `requirements.txt`.

Comprobaciones realizadas localmente:

- Instalé SQLAlchemy 2.x y Flask-SQLAlchemy 3.x y ejecuté `python -m pytest -q -W error` → 6 passed, sin warnings.
- Instalé dependencias clave por separado para evitar fallos en paquetes que requieren compilación (p. ej. `pyyaml`).

Notas y siguientes pasos:

- Revisar `alembic`/migrations para compatibilidad con SQLAlchemy 2.x (probablemente OK pero revisar operaciones de migración).
- Actualizar dependencias que requieren compilación en PRs separados si CI falla (p. ej. `pyyaml`, `psycopg2-binary`).

Checklist:

- [x] Actualizar `requirements.txt`
- [x] Tests locales ejecutados con `-W error`
- [ ] Ejecutar CI y corregir fallos si aparecen
- [ ] Validar operaciones de migración con Alembic en entorno de staging
