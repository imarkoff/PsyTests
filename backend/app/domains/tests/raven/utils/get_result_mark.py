from app.domains.tests.raven.schemas.test_marks import MarksRow
from app.schemas.user import UserDto
from app.domains.tests.raven.utils import test_includes
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.domains.tests.raven.schemas.raven_test import RavenTest
else:
    RavenTest = "RavenTest"


async def get_result_mark(test: RavenTest, points: int, patient: UserDto) -> str | None:
    """
    Get the mark of the test result for the patient.

    Args:
        test (RavenTest): The test.
        points (int): The points of the test result.
        patient (UserDto): The patient.

    Returns:
        str | None: The mark of the test result for the patient.
    """

    marks = await test_includes.get_test_marks(test)

    (age, _) = patient.get_age()

    if marks:
        for mark in marks:
            if is_points_in_range(mark["_"], points):
                return await get_age_mark(mark, age)

    return None


def is_points_in_range(range_str: str, points: int) -> bool:
    """
    Check if points fall within the given range.

    Args:
        range_str (str): The range string (e.g., "10-20" or "15").
        points (int): The points to check.

    Returns:
        bool: True if points fall within the range, False otherwise.
    """

    if isinstance(range_str, int):
        range_str = str(range_str)

    mark_points = range_str.split("-")

    if len(mark_points) == 1:
        return points == int(mark_points[0])

    return int(mark_points[0]) <= points <= int(mark_points[1])


async def get_age_mark(marks_row: MarksRow, age: float) -> str | None:
    """
    Get the mark of the test result for the age.
    """

    sorted_marks = sorted((float(k), v) for k, v in marks_row.items() if k != "_")

    for i, (mark_age, mark) in enumerate(sorted_marks):
        if age < float(mark_age):
            if i == 0:
                return mark
            else:
                return sorted_marks[i - 1][1]

    result = sorted_marks[-1][1]

    return result