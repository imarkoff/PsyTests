from uuid import UUID

from app.exceptions import NotFoundError
from app.repositories.test_history_repository import TestHistoryRepository
from app.schemas.test_result import TestResultDto, TestResultShortDto
from app.services.tests_service import get_test


class TestHistoryGetter:
    def __init__(self, test_history_repository: TestHistoryRepository):
        self.repository = test_history_repository

    async def get_detailed_test_results(self, patient_id: UUID) -> list[TestResultDto]:
        """Get detailed test result DTOs for a patient"""
        tests_with_models = await self._get_tests_with_definitions(patient_id)
        return [
            TestResultDto.from_test_result(test, model)
            for test, model in tests_with_models
        ]

    async def get_test_summaries(self, patient_id: UUID) -> list[TestResultShortDto]:
        """Get compact summary DTOs of patient's test results"""
        tests_with_models = await self._get_tests_with_definitions(patient_id)
        return [
            TestResultShortDto(
                id=test.id,
                test_id=model.id,
                test_name=model.name,
                passed_at=test.passed_at
            )
            for test, model in tests_with_models
        ]

    async def _get_tests_with_definitions(self, patient_id: UUID):
        """Fetch test results with their corresponding test definitions"""
        tests = await self.repository.get_by_patient_id_desc(patient_id)
        result = []

        for test in tests:
            test_bundle = await get_test(test.test_id)
            result.append((test, test_bundle.model))

        return result

    async def get_test_result_by_id(self, patient_id: UUID, test_id: UUID) -> TestResultDto:
        """
        Get a specific test result by id for a patient
        :raises NotFoundError: If test not found
        """
        test_history = await self.repository.get_by_id_and_patient_id(test_id, patient_id)

        if not test_history:
            raise NotFoundError

        test_bundle = await get_test(test_history.test_id)
        test_model = test_bundle.model

        return TestResultDto.from_test_result(test_history, test_model)
