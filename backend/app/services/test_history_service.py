from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.patient_test import PatientTest
from app.db.models.test_history import TestHistory
from app.exceptions import NotFoundError
from app.schemas.test import Test
from app.schemas.test_result import TestResultDto
from app.schemas.test_short import TestShortDto
from app.services.tests_service import get_test
from app.utils.convert_test_to_short import convert_test_to_short
from app.utils.get_test_result import get_test_result


async def pass_test(db: Session, assigned_test_id: UUID, patient_id: UUID, answers: list[int]) -> TestResultDto:
    """
    Pass test

    Raises:
        FileNotFoundError: If test not found
        NotFoundError: If test not found
        ValueError: If answers count is not equal to questions count
    """

    doctor_test: PatientTest | None = db.query(PatientTest).filter(PatientTest.id == assigned_test_id).first()

    if not doctor_test:
        raise NotFoundError

    test = await get_test(doctor_test.test_id, True)

    if len(test.questions) != len(answers):
        raise ValueError

    total_points = 0
    correct_points = 0

    for i, answer in enumerate(answers):
        question = test.questions[i]
        points = question.points if question.points else 1
        total_points += points
        if question.answers[answer].is_correct:
            correct_points += points

    new_history = TestHistory(
        test_id=test.id,
        patient_id=patient_id,
        total_points=total_points,
        correct_points=correct_points
    )

    result = get_test_result(test=test, test_result=new_history)

    db.add(new_history)
    db.commit()

    return test_result_to_dto(new_history, test, result)


async def get_tests_history(db: Session, patient_id: UUID) -> list[TestResultDto]:
    """
    Get tests history
    """

    tests: list[TestHistory] = (db.query(TestHistory)
                                .order_by(TestHistory.passed_at.desc())
                                .filter(TestHistory.patient_id == patient_id)
                                .all())

    tests_results = []

    for db_test in tests:
        test = await get_test(db_test.test_id)
        result = get_test_result(test=test, test_result=db_test)
        tests_results.append(test_result_to_dto(db_test, test, result))

    return tests_results


def test_result_to_dto(test_result: TestHistory, test: Test, result: str | None) -> TestResultDto:
    """
    Convert test result to DTO
    """

    shortened_test = convert_test_to_short(test)

    return TestResultDto(
        id=test_result.id,
        test=TestShortDto(**shortened_test.model_dump()),  # throws validation error if passed var directly
        patient_id=test_result.patient_id,
        total_points=test_result.total_points,
        correct_points=test_result.correct_points,
        result=result,
        passed_at=test_result.passed_at
    )