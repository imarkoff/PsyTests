from fastapi import Depends

from app.dependenies.repositories import get_patient_test_repository
from app.dependenies.services import get_test_service
from app.services.patients.patient_test_service import PatientTestUnassigner, PatientTestGetter


def get_patient_test_getter(
        repository=Depends(get_patient_test_repository),
        test_service=Depends(get_test_service)
):
    return PatientTestGetter(
        patient_test_repository=repository,
        test_service=test_service
    )


def get_patient_test_unassigner(repository=Depends(get_patient_test_repository)):
    return PatientTestUnassigner(repository)