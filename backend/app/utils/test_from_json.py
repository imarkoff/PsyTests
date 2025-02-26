import json
import os
from uuid import UUID

from app.db import tests
from app.schemas.test.test import Test
from app.schemas.test.test_marks import Marks
from app.schemas.test.test_module import TestModule

import pandas as pd
import numpy as np


def test_from_json(test_id: UUID, test_data: dict) -> Test:
    """
    Create Test object from json data
    """

    test = Test(
        id=test_id,
        name=test_data['name'],
        description=test_data.get('description', None),
        questions=test_data.get('questions', None),
        modules=[get_test_module(test_id, module) for module in test_data.get('modules', [])],
        marks=get_test_marks(test_id, test_data)
    )

    return test


def get_test_module(test_id: UUID, module_path: str) -> TestModule:
    """
    Get test module by id

    Raises:
        FileNotFoundError: If test file not found
    """

    test_file = os.path.join(os.path.dirname(tests.__file__), test_id.__str__(), module_path, 'test.json')
    with open(test_file, 'r') as file:
        test_data = json.load(file)
        test_data['id'] = test_id

        return TestModule(
            name=test_data['name'],
            path=module_path,
            description=test_data.get('description', None),
            questions=test_data.get('questions', None)
        )


def get_test_marks(test_id: UUID, test_data: dict) -> Marks | None:
    """
    Get test marks from csv file
    """

    marks: str | None = test_data.get('marks', None)

    if marks:
        marks_file = os.path.join(os.path.dirname(tests.__file__), test_id.__str__(), marks)

        if os.path.isfile(marks_file):
            df = pd.read_csv(marks_file)
            df = df.replace({np.nan: None})
            return df.to_dict(orient='records')

    return None