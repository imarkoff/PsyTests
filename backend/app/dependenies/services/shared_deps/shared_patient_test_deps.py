from fastapi import Depends

from app.dependenies.repositories import get_patient_test_repository
from app.services.patients.patient_test_service import PatientTestUnassigner, PatientTestGetter


def get_patient_test_getter(repository=Depends(get_patient_test_repository)):
    return PatientTestGetter(repository)


def get_patient_test_unassigner(repository=Depends(get_patient_test_repository)):
    return PatientTestUnassigner(repository)