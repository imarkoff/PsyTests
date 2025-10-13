from fastapi import Depends

from .shared_deps.shared_patient_test_deps import get_patient_test_unassigner
from .user_service_di import get_user_service
from app.services.patients.patient_test_service import PatientTestUnassigner
from app.services.user_remover import UserRemover
from app.services.user_service import UserService


def get_user_remover(
    patient_test_unassigner: PatientTestUnassigner = Depends(
        get_patient_test_unassigner
    ),
    user_service: UserService = Depends(get_user_service)
) -> UserRemover:
    return UserRemover(
        patient_test_unassigner=patient_test_unassigner,
        user_service=user_service
    )
