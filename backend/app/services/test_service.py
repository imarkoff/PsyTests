import os
from uuid import UUID

from app.domains.tests.base.test_factory import TestBundle
from app.domains.tests.base.test_base import TestBase
from app.domains.tests.test_factories import TestFactories
from app.exceptions import NotFoundError
from app.repositories.test_repository import TestRepository


class TestService:
    def __init__(self, test_repository: TestRepository, test_factories: TestFactories):
        self.repository = test_repository
        self.test_factories = test_factories

    async def get_all_tests(self) -> list[TestBase]:
        """Get all available tests in default format"""
        return await self.repository.get_all_tests()

    async def get_test(self, test_id: UUID) -> TestBundle:
        """
        Get test by id
        :returns test bundle with its model and service
        :raises NotFoundError: If test not found
        """
        test = await self.repository.get_test_data(test_id)

        if test is None:
            raise NotFoundError(f"Test with ID {test_id} not found")

        test_type = test.get('type')
        test_factory_type = self.test_factories.get_factory_or_default(test_type)
        test_bundle = test_factory_type().get(test)

        return test_bundle

    async def get_test_with_hidden_answers(self, test_id: UUID) -> TestBase:
        """
        Get test by id with hidden answers
        :returns test bundle with its model and service
        :raises NotFoundError: If test not found
        """
        test_bundle = await self.get_test(test_id)
        test_with_hidden_answers = test_bundle.service.hide_correct_answers()
        return test_with_hidden_answers

    async def get_base_test(self, test_id: UUID) -> TestBase:
        """
        Get basic test data by id
        :returns test base model
        :raises NotFoundError: If test not found
        """
        test = await self.repository.get_test_data(test_id)

        if test is None:
            raise NotFoundError(f"Test with ID {test_id} not found")

        test_factory_type = self.test_factories.get_default_factory()
        test_base = test_factory_type().get_model(test)

        return test_base

    async def get_test_image(self, test_id: UUID, module_path: str, image_name: str) -> bytes:
        """
        Get test image by name
        :raises NotFoundError: If image not found
        """
        image = await self.repository.get_image(test_id, os.path.join(module_path, image_name))

        if image is None:
            raise NotFoundError(f"Image {image_name} for test {test_id} not found")

        return image