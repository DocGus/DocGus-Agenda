import os
import sys
import pytest

# Ensure 'src' is on sys.path so imports like `api.models` work
ROOT = os.path.dirname(os.path.dirname(__file__))
SRC = os.path.join(ROOT, 'src')
if SRC not in sys.path:
    sys.path.insert(0, SRC)

# Configure environment so `src/app.py` picks up an in-memory DB on import
os.environ.setdefault('DATABASE_URL', 'sqlite:///:memory:')
os.environ.setdefault('JWT_SECRET_KEY', 'test-secret-key')

from app import app as flask_app
from api.models import db


@pytest.fixture
def client():
    """Provide a Flask test client with an in-memory DB for each test."""
    flask_app.config['TESTING'] = True

    with flask_app.app_context():
        db.create_all()
        try:
            yield flask_app.test_client()
        finally:
            # Remove session and drop all tables
            try:
                db.session.remove()
            except Exception:
                pass
            try:
                db.drop_all()
            except Exception:
                pass

            # Dispose the engine to close any underlying DB connections (avoid ResourceWarning)
            try:
                # Prefer the public `engine` attribute to avoid deprecation warnings
                engine = getattr(db, 'engine', None)
                if engine is not None:
                    try:
                        engine.dispose()
                    except Exception:
                        pass
            except Exception:
                pass
