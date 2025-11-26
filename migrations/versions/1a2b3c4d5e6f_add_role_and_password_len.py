"""add role column and enlarge password column

Revision ID: 1a2b3c4d5e6f
Revises: 0763d677d453
Create Date: 2025-11-26 00:00:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '1a2b3c4d5e6f'
down_revision = '0763d677d453'
branch_labels = None
depends_on = None


def upgrade():
    # Add 'role' column with default value for existing rows
    op.add_column('user', sa.Column('role', sa.String(length=50), nullable=False, server_default='UsuarioAgenda'))

    # Alter 'password' column to have a length limit (best-effort; SQLite may ignore)
    try:
        op.alter_column('user', 'password', existing_type=sa.String(), type_=sa.String(length=255), existing_nullable=False)
    except Exception:
        # Some backends (SQLite) can't alter column types easily; skip if not supported
        pass


def downgrade():
    # Remove role column
    op.drop_column('user', 'role')

    # Revert password column length change if possible
    try:
        op.alter_column('user', 'password', existing_type=sa.String(length=255), type_=sa.String(), existing_nullable=False)
    except Exception:
        pass
