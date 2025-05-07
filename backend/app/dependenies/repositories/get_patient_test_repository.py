from fastapi.params import Depends
from sqlalchemy.orm import Session

from app.db.session import get_postgresql_db
from app.repositories.patient_test_repository import PatientTestRepository


def get_patient_test_repository(db: Session = Depends(get_postgresql_db)):
    return PatientTestRepository(db)