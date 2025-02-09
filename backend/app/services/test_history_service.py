from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.patient_test import PatientTest
from app.db.models.test_history import TestHistory
from app.exceptions import NotFoundError
from app.schemas.pass_test import PassTestDto
from app.schemas.test.test import Test
from app.schemas.test.test_history_results import Results
from app.schemas.test_result import TestResultDto
from app.schemas.test_short import TestShortDto
from app.services.tests_service import get_test
from app.utils.convert_results import convert_results
from app.utils.convert_test_to_short import convert_test_to_short


async def pass_test(db: Session, patient_id: UUID, pass_dto: PassTestDto) -> TestResultDto:
    """
    Pass test

    Raises:
        FileNotFoundError: If test not found
        NotFoundError: If test not found
    """

    doctor_test: PatientTest | None = db.query(PatientTest).filter(PatientTest.id == pass_dto.assigned_test_id).first()

    if not doctor_test:
        raise NotFoundError

    test = await get_test(doctor_test.test_id, True)

    new_history = TestHistory(
        test_id=test.id,
        patient_id=patient_id,
        results=convert_results(test, pass_dto.answers).model_dump()
    )

    db.add(new_history)
    db.commit()

    return test_result_to_dto(new_history, test)


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

        tests_results.append(test_result_to_dto(db_test, test))

    return tests_results


def test_result_to_dto(test_result: TestHistory, test: Test) -> TestResultDto:
    """
    Convert test result to DTO
    """

    shortened_test = convert_test_to_short(test)

    return TestResultDto(
        id=test_result.id,
        test=TestShortDto(**shortened_test.model_dump()),  # throws validation error if passed var directly
        patient_id=test_result.patient_id,
        results=Results.model_validate(test_result.results),
        passed_at=test_result.passed_at
    )