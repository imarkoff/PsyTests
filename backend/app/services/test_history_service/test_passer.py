from uuid import UUID

from app.db.models.test_history import TestHistory
from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_processor import TestProcessor
from app.exceptions import ValidationError
from app.repositories.test_history_repository import TestHistoryRepository
from app.schemas.pass_test import PassTestDto
from app.schemas.test_result import TestResultShortDto
from app.schemas.user_auth import UserDto
from app.services.patients.doctor_patient_service import DoctorPatientChanger
from app.services.patients.patient_test_service import PatientTestGetter
from app.services.test_service import TestService


class TestPasser:
    def __init__(self,
                 test_history_repository: TestHistoryRepository,
                 patient_test_getter: PatientTestGetter,
                 doctor_patient_changer: DoctorPatientChanger,
                 test_service: TestService):
        self.repository = test_history_repository
        self.patient_test_getter = patient_test_getter
        self.doctor_patient_changer = doctor_patient_changer
        self.test_service = test_service

    async def pass_test(self, patient: UserDto, pass_dto: PassTestDto) -> TestResultShortDto:
        """
        Creates new test history record and updates patient attention status.

        Raises:
            NotFoundError: If assigned test or test not found
            ValidationError: If test data is invalid
        """

        if not pass_dto.is_valid():
            raise ValidationError("Invalid test data")

        doctor_test = await self.patient_test_getter.get(pass_dto.assigned_test_id)

        (test_model, test_service) = await self._get_test(doctor_test.test.id)

        new_history = await test_service.pass_test(pass_dto.answers, patient)

        await self.repository.create(new_history)
        await self.doctor_patient_changer.change_attention(patient_id=patient.id, needs_attention=True)

        return self._create_result_dto(new_history, test_model)

    async def _get_test(self, test_id: UUID) -> tuple[TestBase, TestProcessor]:
        test_bundle = await self.test_service.get_test(test_id)
        return test_bundle.model, test_bundle.service

    @staticmethod
    def _create_result_dto(history: TestHistory, test: TestBase) -> TestResultShortDto:
        return TestResultShortDto(
            id=history.id,
            test_id=test.id,
            test_name=test.name,
            passed_at=history.passed_at
        )
