# Script to seed development database with example users
# Usage: pipenv run python tools/seed_dev.py
import sys
import os
sys.path.insert(0, 'src')

from app import app
from api.models import db, User

with app.app_context():
    # ensure tables exist
    db.create_all()

    email = os.environ.get('DEV_SEED_EMAIL', 'dev_user@example.com')
    pwd = os.environ.get('DEV_SEED_PASSWORD', 'devpass')

    existing = db.session.execute(db.select(User).filter_by(email=email)).scalars().first()
    if existing:
        print(f"User already exists: {existing.email} (id={existing.id})")
    else:
        u = User(email=email, is_active=True, role='UsuarioAgenda')
        u.set_password(pwd)
        db.session.add(u)
        db.session.commit()
        print(f"Created user {u.email} (id={u.id})")
