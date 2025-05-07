from fastapi import Depends

from app.db.session import get_postgresql_db
from app.repositories.doctor_patient_repository import DoctorPatientRepository


def get_doctor_patient_repository(db=Depends(get_postgresql_db)):
    return DoctorPatientRepository(db)
