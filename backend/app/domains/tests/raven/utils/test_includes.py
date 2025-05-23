import json
import os
from uuid import UUID

import numpy as np
import pandas as pd

from app.db import tests
from app.domains.tests.raven.schemas.test_marks import Marks
from app.domains.tests.raven.schemas.test_module import TestModule
from app.domains.tests.base.test_base import TestBase


def get_marks_path(test: TestBase) -> str:
    return os.path.join(os.path.dirname(tests.__file__), test.id.__str__(), test.marks_path)


async def get_test_marks(test: TestBase) -> Marks | None:
    """
    Get test marks for a single test.
    """

    if not test.marks_path:
        return None

    marks_file = get_marks_path(test)

    if os.path.isfile(marks_file):
        df = pd.read_csv(marks_file)
        df = df.replace({np.nan: None})
        return df.to_dict(orient='records')

    return None


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
