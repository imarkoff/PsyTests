from uuid import UUID

from app.schemas.pass_test import PassTestDto
from app.schemas.test_result import TestResultDto, TestResultShortDto
from app.schemas.user import UserDto
from app.services.test_history_service.test_history_getter import TestHistoryGetter
from app.services.test_history_service.test_passer import TestPasser
from app.services.test_history_service.test_revalidator import TestRevalidator


class TestHistoryService:
    def __init__(self, test_passer: TestPasser, test_history_getter: TestHistoryGetter,
                 test_revalidator: TestRevalidator):
        self.passer = test_passer
        self.getter = test_history_getter
        self.revalidator = test_revalidator

    async def pass_test(self, patient: UserDto, pass_dto: PassTestDto) -> TestResultShortDto:
        """
        Creates new test history record and updates patient attention status.

        Raises:
            NotFoundError: If assigned test or test not found
            ValidationError: If test data is invalid
        """
        return await self.passer.pass_test(patient, pass_dto)

    async def get_detailed_test_results(self, patient_id: UUID) -> list[TestResultDto]:
        """Get detailed test result DTOs for a patient"""
        return await self.getter.get_detailed_test_results(patient_id)

    async def get_test_summaries(self, patient_id: UUID) -> list[TestResultShortDto]:
        """Get compact summary DTOs of patient's test results"""
        return await self.getter.get_test_summaries(patient_id)

    async def get_test_result_by_id(self, patient_id: UUID, test_id: UUID) -> TestResultDto:
        """
        Get a specific test result by id for a patient
        :raises NotFoundError: If test not found
        """
        return await self.getter.get_test_result_by_id(patient_id, test_id)

    async def revalidate_test(self, patient_id: UUID, test_id: UUID) -> TestResultDto:
        """
        Revalidate verdicts for a passed test
        :Raises NotFoundError: If test not found
        """
        return await self.revalidator.revalidate_test(patient_id, test_id)
