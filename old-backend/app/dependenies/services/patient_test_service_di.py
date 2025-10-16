from fastapi import Depends

from app.dependenies.repositories import get_patient_test_repository
from app.dependenies.services.shared_deps.shared_doctor_patient_deps import get_doctor_patient_getter
from app.dependenies.services.shared_deps.shared_patient_test_deps import get_patient_test_unassigner, \
    get_patient_test_getter
from app.dependenies.services import get_test_service
from app.services.patients.patient_test_service import *


def get_patient_test_assigner(
        repository=Depends(get_patient_test_repository),
        getter=Depends(get_doctor_patient_getter),
        test_service=Depends(get_test_service),
):
    return PatientTestAssigner(
        patient_test_repository=repository,
        doctor_patient_getter=getter,
        test_service=test_service
    )


def get_patient_test_service(
        getter=Depends(get_patient_test_getter),
        assigner=Depends(get_patient_test_assigner),
        unassigner=Depends(get_patient_test_unassigner)
) -> PatientTestService:
    return PatientTestService(
        patient_test_assigner=assigner,
        patient_test_getter=getter,
        patient_test_unassigner=unassigner,
    )
