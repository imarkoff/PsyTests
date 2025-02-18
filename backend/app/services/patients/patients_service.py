"""
Service for managing doctor patients
"""

from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.models.doctor_patient import DoctorPatient
from app.db.models.user import User
from app.exceptions import NotFoundError, AlreadyExistsError
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.patients.patient_create import PatientCreateDto
from app.schemas.patients.patient_search_dto import PatientSearchDto
from app.schemas.role import Role
from app.schemas.user_auth import UserCreate
from app.services import user_service
from app.services.patients import patient_tests_service


async def get_patients(db: Session, doctor_id: UUID) -> list[DoctorPatientDto]:
    """
    Get active doctor patients
    """
    doctor_patients = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id,
        DoctorPatient.is_active.is_(True)
    ).all()

    return [DoctorPatientDto.create(doctor_patient) for doctor_patient in doctor_patients]


async def get_patient(db: Session, doctor_id: UUID, patient_id: UUID) -> DoctorPatientDto:
    """
    Get patient info

    Raises:
        NotFoundError: If doctor_patient not found
    """
    doctor_patient = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id,
        DoctorPatient.patient_id == patient_id
    ).first()

    if not doctor_patient:
        raise NotFoundError

    return DoctorPatientDto.create(doctor_patient)


async def find_patient(db: Session, doctor_id: UUID, search: str) -> PatientSearchDto:
    """
    Find patient in database by name, surname, phone number or email.
    Also sort patients by doctor patients and other patients
    """

    patients = db.query(User).filter(
        User.role == Role.PATIENT,
        or_(
            User.name.ilike(f"%{search}%"),
            User.surname.ilike(f"%{search}%"),
            User.phone.ilike(f"%{search}%")
        )
    ).all()

    doctor_patients = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id,
        DoctorPatient.patient_id.in_([patient.id for patient in patients])
    ).all()

    doctor_patient_ids = {doctor_patient.patient_id for doctor_patient in doctor_patients}
    other_patients = [patient for patient in patients if patient.id not in doctor_patient_ids]

    return PatientSearchDto.create(doctor_patients, other_patients)


async def assign_patient(db: Session, doctor_id: UUID, patient_id: UUID) -> DoctorPatientDto:
    """
    Add patient to doctor patients

    Raises:
        AlreadyExistsError: If doctor_patient already exists
    """
    existing_doctor_patient = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id,
        DoctorPatient.patient_id == patient_id
    ).first()

    if existing_doctor_patient:
        raise AlreadyExistsError

    doctor_patient = DoctorPatient(doctor_id=doctor_id, patient_id=patient_id)

    db.add(doctor_patient)
    db.commit()

    return DoctorPatientDto.create(doctor_patient)


async def create_patient(db: Session, doctor_id: UUID, patient: PatientCreateDto) -> DoctorPatientDto:
    """
    Create new patient and add to doctor patients

    Raises:
        AlreadyExistsError: If patient already exists
    """

    existing_user = user_service.get_user_by_phone(db=db, phone=patient.phone)

    if existing_user:
        raise AlreadyExistsError

    new_user = UserCreate(
        name=patient.name,
        surname=patient.surname,
        patronymic=patient.patronymic,
        birth_date=patient.birth_date,
        phone=patient.phone,
        role=Role.PATIENT,
        password=patient.password
    )

    user = user_service.register_user(db=db, user_dto=new_user)

    doctor_patient = DoctorPatient(doctor_id=doctor_id, patient_id=user.id)

    db.add(doctor_patient)
    db.commit()

    return DoctorPatientDto.create(doctor_patient)


async def change_attention(db: Session, patient_id: UUID, needs_attention: bool) -> None:
    """
    Change patient needs attention status
    """

    db.query(DoctorPatient).filter(
        DoctorPatient.patient_id == patient_id
    ).update(
        {DoctorPatient.needs_attention: needs_attention},
        synchronize_session=False
    )

    db.commit()


async def change_status(db: Session, patient_id: UUID, is_active: bool) -> None:
    """
    Change patient status
    """

    db.query(DoctorPatient).filter(
        DoctorPatient.patient_id == patient_id
    ).update(
        {DoctorPatient.is_active: is_active},
        synchronize_session=False
    )

    db.commit()


async def delete_patient(db: Session, doctor_id: UUID, patient_id: UUID) -> None:
    """
    Delete patient from doctor patients

    Raises:
        NotFoundError: If doctor_patient not found
    """
    doctor_patient = db.query(DoctorPatient).filter(
        DoctorPatient.doctor_id == doctor_id,
        DoctorPatient.patient_id == patient_id
    ).first()

    if doctor_patient:
        await patient_tests_service.unassign_doctor_tests(db, doctor_id, patient_id)
        db.delete(doctor_patient)
        db.commit()
    else:
        raise NotFoundError