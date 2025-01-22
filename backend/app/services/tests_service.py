import os
import json
from uuid import UUID

from app.schemas.test import Test
from app.db import tests


async def get_tests() -> list[Test]:
    tests_dir = os.path.dirname(tests.__file__)
    test_list = []
    for test_folder in os.listdir(tests_dir):
        folder_path = os.path.join(tests_dir, test_folder)
        if os.path.isdir(folder_path):
            test_file = os.path.join(folder_path, 'test.json')
            if os.path.isfile(test_file):
                with open(test_file, 'r') as file:
                    test_data = json.load(file)
                    test_data['id'] = test_folder
                    test = Test(**test_data)
                    test_list.append(test)

    return test_list


async def get_test(test_id: UUID) -> Test:
    """
    Get test by id

    Raises:
        FileNotFoundError: If test file not found
    """

    test_file = os.path.join(os.path.dirname(tests.__file__), test_id.__str__(), 'test.json')
    with open(test_file, 'r') as file:
        test_data = json.load(file)
        test_data['id'] = test_id
        return Test(**test_data)


async def get_test_image(test_id: UUID, image_name: str) -> bytes:
    """
    Get test image by name

    Raises:
        FileNotFoundError: If image file not found
    """

    image_path = os.path.join(os.path.dirname(tests.__file__), test_id.__str__(), image_name)
    with open(image_path, 'rb') as file:
        return file.read()
