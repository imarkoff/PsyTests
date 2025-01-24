from app.schemas.test import Test
from app.schemas.test_short import TestShortDto

def convert_test_to_short(test: Test) -> TestShortDto:
    return TestShortDto(
        id=test.id,
        name=test.name,
        description=test.description,
        marks=test.marks,
        questions_count=len(test.questions)
    )