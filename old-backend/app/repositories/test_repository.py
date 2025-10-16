import json
import os
from uuid import UUID

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.repositories.file_system_repository import FileSystemRepository
from app.settings import Settings


class TestRepository(FileSystemRepository):
    TEST_DEFINITION_FILENAME = 'test.json'

    def __init__(self, test_factory: TestFactory, settings: Settings):
        """
        :param entity_dir: Directory where test files are stored
        :param test_factory: Factory to create test instances
        """
        self.test_factory = test_factory
        self.entity_dir = settings.PSY_TESTS_DIR
        super().__init__(self.entity_dir)

    async def get_all_tests(self) -> list[TestBase]:
        """Get all available tests"""
        test_list = []

        for test_id in os.listdir(self.entity_dir):
            test_full_path = os.path.join(self.entity_dir, test_id)
            if os.path.isdir(test_full_path):
                test_file = os.path.join(test_full_path, self.TEST_DEFINITION_FILENAME)

                if os.path.isfile(test_file):
                    with open(test_file, 'r') as file:
                        test_data = json.load(file)
                        test = self.test_factory.get_model(test_data)
                        test_list.append(test)

        return test_list

    async def get_test_data(self, test_id: UUID) -> dict | None:
        """Get raw test data by ID"""
        test_file = os.path.join(
            self.entity_dir,
            test_id.__str__(),
            self.TEST_DEFINITION_FILENAME
        )

        if os.path.isfile(test_file):
            with open(test_file, 'r') as file:
                return json.load(file)
        else:
            return None
