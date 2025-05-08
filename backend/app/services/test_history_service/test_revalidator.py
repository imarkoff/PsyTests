from uuid import UUID

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_processor import TestProcessor
from app.exceptions import NotFoundError
from app.repositories.test_history_repository import TestHistoryRepository
from app.schemas.test_result import TestResultDto
from app.services.test_service import TestService


class TestRevalidator:
    def __init__(self, test_history_repository: TestHistoryRepository, test_service: TestService):
        self.repository = test_history_repository
        self.test_service = test_service

    async def revalidate_test(self, patient_id: UUID, test_id: UUID) -> TestResultDto:
        """
        Revalidate verdicts for a passed test
        :Raises NotFoundError: If test not found
        """
        test_history = await self.repository.get_by_id_and_patient_id(test_id, patient_id)

        if not test_history:
            raise NotFoundError(f"Test history with ID {test_id} and patient ID {patient_id} not found")

        (test_model, test_service) = await self._get_test_bundle(test_history.test_id)

        await test_service.revalidate_test(test_history)
        await self.repository.update(test_history)

        return TestResultDto.from_test_result(test_history, test_model)

    async def _get_test_bundle(self, test_id: UUID) -> tuple[TestBase, TestProcessor]:
        test_bundle = await self.test_service.get_test(test_id)
        return test_bundle.model, test_bundle.service
