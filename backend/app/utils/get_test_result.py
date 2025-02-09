from app.db.models.test_history import TestHistory
from app.schemas.test.test import Test


def get_test_result(test: Test, test_result: TestHistory) -> str | None:
    """
    Get test result
    """

    correct_percent = test_result.correct_points / test_result.total_points * 100
    actual_result = None

    if test.marks:
        for mark, result in test.marks.items():
            if correct_percent <= int(mark):
                actual_result = result
                break

    return actual_result