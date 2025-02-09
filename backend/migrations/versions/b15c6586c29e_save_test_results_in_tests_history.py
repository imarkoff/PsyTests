"""Save test results in tests_history

Revision ID: b15c6586c29e
Revises: 290fe72bd9a2
Create Date: 2025-02-09 22:14:29.138459

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'b15c6586c29e'
down_revision: Union[str, None] = '290fe72bd9a2'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('tests_history', sa.Column('results', sa.JSON(), nullable=False, server_default='{}'))
    op.drop_column('tests_history', 'correct_points')
    op.drop_column('tests_history', 'total_points')
    # ### end Alembic commands ###


def downgrade() -> None:
    op.add_column('tests_history', sa.Column('total_points', sa.INTEGER(), autoincrement=False, nullable=False, server_default='0'))
    op.add_column('tests_history', sa.Column('correct_points', sa.INTEGER(), autoincrement=False, nullable=False, server_default='0'))
    op.drop_column('tests_history', 'results')
    # ### end Alembic commands ###
