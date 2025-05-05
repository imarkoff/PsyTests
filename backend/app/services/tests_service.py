import os
import json
from uuid import UUID

from app.db import tests
from app.services.tests.test_factory import TestBundle
from app.tests.base.services.test_factory_impl import TestFactoryImpl
from app.schemas.test_base import TestBase
from app.tests.test_factories import TestFactories


async def get_tests() -> list[TestBase]:
    tests_dir = os.path.dirname(tests.__file__)
    test_list = []

    for test_folder in os.listdir(tests_dir):
        folder_path = os.path.join(tests_dir, test_folder
                                   )
        if os.path.isdir(folder_path):
            test_file = os.path.join(folder_path, 'test.json')

            if os.path.isfile(test_file):
                with open(test_file, 'r') as file:
                    test_data = json.load(file)
                    test = TestFactoryImpl().get_model(test_data)
                    test_list.append(test)

    return test_list


async def get_test(test_id: UUID) -> TestBundle:
    """
    Get test by id

    Raises:
        FileNotFoundError: If test file not found
    """

    test_file = os.path.join(os.path.dirname(tests.__file__), test_id.__str__(), 'test.json')
    with open(test_file, 'r') as file:
        test_data = json.load(file)

        test_type = test_data.get('type')
        test_factory_type = TestFactories().get_factory_or_default(test_type)

        test_bundle = test_factory_type().get(test_data)
        return test_bundle


async def get_test_image(test_id: UUID, module_path: str, image_name: str) -> bytes:
    """
    Get test image by name

    Raises:
        FileNotFoundError: If image file not found
    """

    image_path = os.path.join(os.path.dirname(tests.__file__), test_id.__str__(), module_path, image_name)
    with open(image_path, 'rb') as file:
        return file.read()
