
import os
import inspect
from . import models
from .models import db


def setup_admin(app):
    """Lazily import flask-admin to avoid import-time issues on some envs.

    If flask-admin or its dependencies are missing/incompatible, skip admin setup
    so the application can still run (useful for tests or minimal dev setups).
    """
    try:
        from flask_admin import Admin
        from flask_admin.contrib.sqla import ModelView
        from flask_admin.theme import Bootstrap4Theme
    except Exception:
        # If flask-admin isn't available or raises an import error (e.g. due to
        # incompatible MarkupSafe/Jinja/SQLAlchemy versions), skip admin setup.
        app.logger.warning('flask-admin not available or failed to import; admin UI disabled')
        return

    app.secret_key = os.environ.get('FLASK_APP_KEY', 'sample key')
    admin = Admin(app, name='4Geeks Admin', theme=Bootstrap4Theme(swatch='cerulean'))

    # Dynamically add all models to the admin interface
    for name, obj in inspect.getmembers(models):
        # Verify that the object is a SQLAlchemy model before adding it to the admin.
        try:
            if inspect.isclass(obj) and issubclass(obj, db.Model):
                admin.add_view(ModelView(obj, db.session))
        except Exception:
            # Skip problematic models
            continue