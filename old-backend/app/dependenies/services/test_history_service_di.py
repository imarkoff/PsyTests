from fastapi import Depends

from app.dependenies.repositories.test_history_repository_di import get_test_history_repository
from app.dependenies.services import get_test_service
from app.dependenies.services.shared_deps.shared_doctor_patient_deps import get_doctor_patient_changer
from app.dependenies.services.shared_deps.shared_patient_test_deps import get_patient_test_getter
from app.services.test_history_service.test_history_getter import TestHistoryGetter
from app.services.test_history_service.test_history_service import TestHistoryService
from app.services.test_history_service.test_passer import TestPasser
from app.services.test_history_service.test_revalidator import TestRevalidator


def get_test_passer(
        repository=Depends(get_test_history_repository),
        patient_test_getter=Depends(get_patient_test_getter),
        doctor_patient_changer=Depends(get_doctor_patient_changer),
        test_service=Depends(get_test_service)
):
    return TestPasser(
        test_history_repository=repository,
        patient_test_getter=patient_test_getter,
        doctor_patient_changer=doctor_patient_changer,
        test_service=test_service
    )


def get_test_history_service(
        repository=Depends(get_test_history_repository),
        passer=Depends(get_test_passer),
        test_service=Depends(get_test_service)
) -> TestHistoryService:
    getter = TestHistoryGetter(repository, test_service)
    revalidator = TestRevalidator(repository, test_service)
    return TestHistoryService(
        test_passer=passer,
        test_history_getter=getter,
        test_revalidator=revalidator
    )
