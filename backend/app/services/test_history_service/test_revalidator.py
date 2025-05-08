from uuid import UUID

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_service import TestService
from app.exceptions import NotFoundError
from app.repositories.test_history_repository import TestHistoryRepository
from app.schemas.test_result import TestResultDto
from app.services.tests_service import get_test


class TestRevalidator:
    def __init__(self, test_history_repository: TestHistoryRepository):
        self.repository = test_history_repository

    async def revalidate_test(self, patient_id: UUID, test_id: UUID) -> TestResultDto:
        """
        Revalidate verdicts for a passed test
        :Raises NotFoundError: If test not found
        """
        test_history = await self.repository.get_by_id_and_patient_id(test_id, patient_id)

        if not test_history:
            raise NotFoundError

        (test_model, test_service) = await self._get_test_bundle(test_history.test_id)

        await test_service.revalidate_test(test_history)
        await self.repository.update(test_history)

        return TestResultDto.from_test_result(test_history, test_model)

    async def _get_test_bundle(self, test_id: UUID) -> tuple[TestBase, TestService]:
        test_bundle = await get_test(test_id)
        return test_bundle.model, test_bundle.service
