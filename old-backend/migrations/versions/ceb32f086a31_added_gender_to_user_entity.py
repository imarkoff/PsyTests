"""Added gender to User entity

Revision ID: ceb32f086a31
Revises: 98e13240c777
Create Date: 2025-04-21 11:35:48.676254

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'ceb32f086a31'
down_revision: Union[str, None] = '98e13240c777'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('users', sa.Column('gender', sa.String(), nullable=True))
    op.execute("UPDATE users SET gender = 'male'")
    op.alter_column('users', 'gender', nullable=False)
    op.create_index(op.f('ix_users_gender'), 'users', ['gender'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_users_gender'), table_name='users')
    op.drop_column('users', 'gender')