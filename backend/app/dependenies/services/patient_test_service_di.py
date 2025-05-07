from fastapi import Depends

from app.dependenies.repositories import get_patient_test_repository
from app.dependenies.services.shared_doctor_patient_deps import get_doctor_patient_getter
from app.dependenies.services.shared_patient_test_deps import get_patient_test_unassigner
from app.services.patients.patient_test_service import *


def get_patient_test_assigner(
        repository=Depends(get_patient_test_repository),
        getter=Depends(get_doctor_patient_getter)
):
    return PatientTestAssigner(patient_test_repository=repository, doctor_patient_getter=getter)


def get_patient_test_service(
        assigner=Depends(get_patient_test_assigner),
        unassigner=Depends(get_patient_test_unassigner),
        repository=Depends(get_patient_test_repository)
) -> PatientTestService:
    getter = PatientTestGetter(repository)
    return PatientTestService(
        patient_test_assigner=assigner,
        patient_test_getter=getter,
        patient_test_unassigner=unassigner,
    )
