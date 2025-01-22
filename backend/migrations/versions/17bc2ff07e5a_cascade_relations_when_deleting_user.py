"""Cascade relations when deleting user

Revision ID: 17bc2ff07e5a
Revises: fa8a8ef35265
Create Date: 2025-01-22 16:27:46.236453

"""
from typing import Sequence, Union

from alembic import op


# revision identifiers, used by Alembic.
revision: str = '17bc2ff07e5a'
down_revision: Union[str, None] = 'fa8a8ef35265'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add ON DELETE CASCADE to doctor_patients table
    op.drop_constraint('doctor_patients_doctor_id_fkey', 'doctor_patients', type_='foreignkey')
    op.drop_constraint('doctor_patients_patient_id_fkey', 'doctor_patients', type_='foreignkey')
    op.create_foreign_key('doctor_patients_doctor_id_fkey', 'doctor_patients', 'users', ['doctor_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('doctor_patients_patient_id_fkey', 'doctor_patients', 'users', ['patient_id'], ['id'], ondelete='CASCADE')

    # Add ON DELETE CASCADE to patient_tests table
    op.drop_constraint('patient_tests_patient_id_fkey', 'patient_tests', type_='foreignkey')
    op.drop_constraint('patient_tests_assigned_by_id_fkey', 'patient_tests', type_='foreignkey')
    op.create_foreign_key('patient_tests_patient_id_fkey', 'patient_tests', 'users', ['patient_id'], ['id'], ondelete='CASCADE')
    op.create_foreign_key('patient_tests_assigned_by_id_fkey', 'patient_tests', 'users', ['assigned_by_id'], ['id'], ondelete='CASCADE')


def downgrade() -> None:
    # Remove ON DELETE CASCADE from doctor_patients table
    op.drop_constraint('doctor_patients_doctor_id_fkey', 'doctor_patients', type_='foreignkey')
    op.drop_constraint('doctor_patients_patient_id_fkey', 'doctor_patients', type_='foreignkey')
    op.create_foreign_key('doctor_patients_doctor_id_fkey', 'doctor_patients', 'users', ['doctor_id'], ['id'])
    op.create_foreign_key('doctor_patients_patient_id_fkey', 'doctor_patients', 'users', ['patient_id'], ['id'])

    # Remove ON DELETE CASCADE from patient_tests table
    op.drop_constraint('patient_tests_patient_id_fkey', 'patient_tests', type_='foreignkey')
    op.drop_constraint('patient_tests_assigned_by_id_fkey', 'patient_tests', type_='foreignkey')
    op.create_foreign_key('patient_tests_patient_id_fkey', 'patient_tests', 'users', ['patient_id'], ['id'])
    op.create_foreign_key('patient_tests_assigned_by_id_fkey', 'patient_tests', 'users', ['assigned_by_id'], ['id'])