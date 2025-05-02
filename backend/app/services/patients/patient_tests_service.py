from datetime import datetime, UTC
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
        DoctorPatient.patient_id == patient_id,
        DoctorPatient.doctor_id == doctor_id
    ).first()

    if not user:
        raise NotFoundError

    await get_test(test_id)  # Check if test exists

    existing_test = db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        PatientTest.test_id == test_id,
        PatientTest.unassigned_at == None
    ).first()

    if existing_test:
        raise AlreadyExistsError

    new_test = PatientTest(patient_id=patient_id, assigned_by_id=doctor_id, test_id=test_id)

    db.add(new_test)
    db.commit()

    return await PatientTestDto.create(new_test)


async def get_patient_tests(db: Session, patient_id: UUID) -> list[PatientTestDto]:
    """
    Get patient tests
    """

    tests = db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        PatientTest.unassigned_at == None
    ).all()

    return [await PatientTestDto.create(test) for test in tests]


async def get_patient_tests_by_doctor(db: Session, doctor_id: UUID, patient_id: UUID) -> list[PatientTestDto]:
    """
    Get patient tests by doctor

    Raises:
        NotFoundError: If patient not found
    """

    tests = (db.query(PatientTest)
             .join(DoctorPatient, DoctorPatient.patient_id == PatientTest.patient_id)
             .filter(PatientTest.patient_id == patient_id,
                     DoctorPatient.doctor_id == doctor_id,
                     PatientTest.unassigned_at == None)
             .all())

    if not tests:
        user = db.query(DoctorPatient).filter(
            DoctorPatient.patient_id == patient_id,
            DoctorPatient.doctor_id == doctor_id
        ).first()
        if not user:
            raise NotFoundError

    return [await PatientTestDto.create(test) for test in tests]


async def get_patient_test(db: Session, patient_id: UUID, test_id: UUID) -> PatientTestDto:
    """
    Get patient test

    Raises:
        NotFoundError: If test not found
    """

    test = db.query(PatientTest).filter(
        PatientTest.id == test_id,
        PatientTest.patient_id == patient_id
    ).first()

    if not test:
        raise NotFoundError

    if test.patient_id != patient_id:
        raise NotFoundError

    return await PatientTestDto.create(test)


async def unassign_test(db: Session, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> None:
    """
    Unassign test from patient

    Raises:
        NotFoundError: If test not found
    """

    test: PatientTest | None = db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        PatientTest.id == test_id,
        DoctorPatient.doctor_id == doctor_id
    ).first()

    if not test:
        raise NotFoundError

    test.unassigned_at = datetime.now(UTC)
    db.commit()


async def unassign_doctor_tests(db: Session, doctor_id: UUID, patient_id: UUID) -> None:
    """
    Unassign all tests from patient
    """

    db.query(PatientTest).filter(
        PatientTest.patient_id == patient_id,
        PatientTest.assigned_by_id == doctor_id
    ).update(
        {PatientTest.unassigned_at: datetime.now(UTC)},
        synchronize_session=False
    )

    db.commit()
