from typing import cast
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.patient_test import PatientTest
from app.db.models.test_history import TestHistory
from app.exceptions import NotFoundError
from app.schemas.pass_test import PassTestDto
from app.schemas.test.test import Test
from app.schemas.test_result import TestResultDto, TestResultShortDto
from app.schemas.test_base import TestBase
from app.schemas.user_auth import UserDto
from app.services.patients import patients_service
from app.services.tests_service import get_test
from app.utils.calculate_points import calculate_points
from app.utils.convert_results import convert_results
from app.utils.get_result_mark import get_result_mark


async def pass_test(db: Session, patient: UserDto, pass_dto: PassTestDto) -> TestResultShortDto:
    """
    Pass test

    Raises:
        FileNotFoundError: If test not found
        NotFoundError: If test not found
    """

    doctor_test: PatientTest | None = db.query(PatientTest).filter(PatientTest.id == pass_dto.assigned_test_id).first()

    if not doctor_test:
        raise NotFoundError

    test: Test = await get_test(doctor_test.test_id, Test)

    collected_points = await calculate_points(test, pass_dto.answers)

    new_history = TestHistory(
        test_id=test.id,
        patient_id=patient.id,
        results=convert_results(test, pass_dto.answers).model_dump(),
        verdict=await get_result_mark(test.marks, collected_points[1], patient)
    )

    db.add(new_history)
    db.commit()

    await patients_service.change_attention(db, patient.id, True)

    return TestResultShortDto(
        id=new_history.id,
        test_id=test.id,
        test_name=test.name,
        passed_at=new_history.passed_at
    )


async def get_tests_history(db: Session, patient_id: UUID, short: bool = False) -> list[TestResultDto]:
    """
    Get tests history
    """

    tests= (db.query(TestHistory)
        .order_by(TestHistory.passed_at.desc())
        .filter(TestHistory.patient_id == patient_id)
        .all())

    tests_results = []

    for db_test in tests:
        db_test = cast(TestHistory, db_test)
        test = await get_test(db_test.test_id, TestBase)

        tests_results.append(
            TestResultDto.from_test_result(db_test, test)
            if not short else
            TestResultShortDto(
                id=db_test.id,
                test_id=test.id,
                test_name=test.name,
                passed_at=db_test.passed_at
            )
        )

    return tests_results


async def get_test_history(db: Session, patient_id: UUID, test_id: UUID) -> TestResultDto:
    """
    Get test history
    """

    db_test_history = (db.query(TestHistory).filter(
        TestHistory.patient_id == patient_id,
        TestHistory.id == test_id
    ).first())

    if not db_test_history:
        raise NotFoundError

    test_history = cast(TestHistory, db_test_history)
    test = await get_test(test_history.test_id, TestBase)

    return TestResultDto.from_test_result(test_history, test)