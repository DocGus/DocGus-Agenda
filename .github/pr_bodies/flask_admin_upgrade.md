Resumen:

- Bump `flask-admin` to `>=2.0,<3.0` in `requirements.txt`.

Comprobaciones realizadas localmente:

- Instalé `flask-admin` 2.0.2 y ejecuté `python -m pytest -q -W error` → 6 passed, sin warnings.

Notas y siguientes pasos:

- Verificar UI del admin en entorno de staging/manualmente (Flask-Admin 2.x puede introducir cambios visuales o en las extensiones).\
- Si CI muestra fallos de dependencias compiladas, ajustar workflow o crear PRs por dependencias individuales.

Checklist:

- [x] Actualizar `requirements.txt`
- [x] Tests locales ejecutados con `-W error`
- [ ] Ejecutar CI y corregir fallos si aparecen
- [ ] Pruebas manuales UI del admin en staging
