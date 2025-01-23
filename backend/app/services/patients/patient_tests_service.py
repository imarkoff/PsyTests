import logging
from uuid import UUID

from sqlalchemy.orm import Session

from app.db.models.doctor_patient import DoctorPatient
from app.db.models.patient_test import PatientTest
from app.exceptions import NotFoundError, AlreadyExistsError
from app.schemas.patients.patient_test import PatientTestDto
from app.services.tests_service import get_test


async def assign_test(db: Session, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> PatientTestDto:
    """
    Assign test to patient

    Raises:
        FileNotFoundError: If test not found
        NotFoundError: If patient not found
        AlreadyExistsError: If test already assigned to client
    """

    user = db.query(DoctorPatient).filter(
        DoctorPatient.patient_id == patient_id and DoctorPatient.doctor_id == doctor_id
    ).first()

    if not user:
        raise NotFoundError

    await get_test(test_id)

    existing_test = db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id and PatientTest.test_id == test_id
    ).first()

    if existing_test:
        raise AlreadyExistsError

    new_test = PatientTest(patient_id=patient_id, assigned_by_id=doctor_id, test_id=test_id)

    db.add(new_test)
    db.commit()

    return await test_to_dto(new_test, True)


async def get_patient_tests(db: Session, patient_id: UUID) -> list[PatientTestDto]:
    """
    Get patient tests
    """

    tests = db.query(PatientTest).filter(PatientTest.patient_id == patient_id).all()
    return [await test_to_dto(test) for test in tests]


async def get_patient_tests_by_doctor(db: Session, doctor_id: UUID, patient_id: UUID) -> list[PatientTestDto]:
    """
    Get patient tests by doctor

    Raises:
        NotFoundError: If patient not found
    """

    tests = db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        DoctorPatient.doctor_id == doctor_id
    ).all()

    logging.info(tests)

    if not tests:
        user = db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.doctor_id == doctor_id
        ).first()
        if not user:
            raise NotFoundError

    return [await test_to_dto(test, True) for test in tests]


async def get_patient_test(db: Session, patient_id: UUID, test_id: UUID) -> PatientTestDto:
    """
    Get patient test

    Raises:
        NotFoundError: If test not found
    """

    test = db.query(PatientTest).filter(PatientTest.id == test_id).first()

    if not test:
        raise NotFoundError

    if test.patient_id != patient_id:
        raise NotFoundError

    return await test_to_dto(test)


async def unassign_test(db: Session, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> None:
    """
    Unassign test from patient

    Raises:
        NotFoundError: If test not found
    """

    test = db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        PatientTest.id == test_id,
        DoctorPatient.doctor_id == doctor_id
    ).first()

    if not test:
        raise NotFoundError

    db.delete(test)
    db.commit()


async def unassign_doctor_tests(db: Session, doctor_id: UUID, patient_id: UUID) -> None:
    """
    Unassign all tests from patient

    Raises:
        NotFoundError: If patient not found
    """

    user = db.query(DoctorPatient).filter(
        DoctorPatient.patient_id == patient_id,
        DoctorPatient.doctor_id == doctor_id
    ).first()

    if not user:
        raise NotFoundError

    db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        PatientTest.assigned_by_id == doctor_id
    ).delete()
    db.commit()


async def test_to_dto(test: PatientTest, show_correct_answers = False) -> PatientTestDto:
    return PatientTestDto(
        id=test.id,
        patient_id=test.patient_id,
        assigned_by_id=test.assigned_by_id,
        test=await get_test(test.test_id, show_correct_answers),
        assigned_at=test.assigned_at
    )