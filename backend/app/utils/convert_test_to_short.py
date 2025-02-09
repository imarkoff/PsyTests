from app.schemas.test.test import Test
from app.schemas.test_short import TestShortDto

def convert_test_to_short(test: Test) -> TestShortDto:
    questions_count = 0

    if test.questions:
        questions_count = len(test.questions)

    for module in test.modules:
        questions_count += len(module.questions)

    return TestShortDto(
        id=test.id,
        name=test.name,
        description=test.description,
        marks=test.marks,
        questions_count=questions_count,
    )