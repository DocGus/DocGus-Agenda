Resumen:

- Bump `alembic` to `>=1.8,<2.0`, `psycopg2-binary` to `>=2.9,<3.0` and `pyyaml` to `>=6.0,<7.0` in `requirements.txt`.

Comprobaciones realizadas localmente:

- Instalé Alembic 1.11.1, psycopg2-binary 2.9.10 y PyYAML 6.0.3 y ejecuté `python -m pytest -q -W error` → 6 passed, sin warnings.
- Instalé paquetes actualizados de forma selectiva para evitar fallos en paquetes que requieren compilación.

Notas y siguientes pasos:

- Si CI falla por dependencias de compilación, ajustar el workflow (instalar `libpq-dev`, `build-essential`, `python3-dev`) y/o crear PRs para cada dependencia problemática.
- Revisar `alembic`/migrations en staging antes de aplicar a producción.

Checklist:

- [x] Actualizar `requirements.txt`
- [x] Tests locales ejecutados con `-W error`
- [ ] Ejecutar CI y corregir fallos si aparecen
- [ ] Validar migraciones con Alembic en staging
