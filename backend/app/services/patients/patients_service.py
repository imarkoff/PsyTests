"""
Service for managing doctor patients
"""

from uuid import UUID

from sqlalchemy import or_
from sqlalchemy.orm import Session

from app.db.models.doctor_patient import DoctorPatient
from app.db.models.user import User
from app.exceptions import NotFoundError, AlreadyExistsError
from app.schemas.patients.patient_create import PatientCreateDto
from app.schemas.patients.patient_info import PatientInfoDto
from app.schemas.role import Role
from app.schemas.user_auth import UserDto, UserCreate
from app.services import user_service
from app.services.patients import patient_tests_service


async def get_patients(db: Session, doctor_id: UUID) -> list[UserDto]:
    """
    Get doctor patients
    """
    doctor_patients = db.query(DoctorPatient).filter(DoctorPatient.doctor_id == doctor_id).all()

    return [UserDto.model_validate(doctor_patient.patient) for doctor_patient in doctor_patients]


async def get_patient(db: Session, doctor_id: UUID, patient_id: UUID) -> PatientInfoDto:
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

    patient_dto = UserDto.model_validate(doctor_patient.patient)
    patient_tests = await patient_tests_service.get_patient_tests_by_doctor(db, doctor_id, patient_id)

    return PatientInfoDto(patient=patient_dto, tests=patient_tests)


async def find_patient(db: Session, search: str) -> list[UserDto]:
    """
    Find patient in database by name, surname, phone number or email
    """
    patients = db.query(User).filter(
        or_(
            User.name.ilike(f"%{search}%"),
            User.surname.ilike(f"%{search}%"),
            User.phone.ilike(f"%{search}%")
        )
    ).all()

    return [UserDto.model_validate(patient) for patient in patients]


async def assign_patient(db: Session, doctor_id: UUID, patient_id: UUID) -> UserDto:
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

    return UserDto.model_validate(doctor_patient.patient)


async def create_patient(db: Session, doctor_id: UUID, patient: PatientCreateDto) -> UserDto:
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
        phone=patient.phone,
        role=Role.PATIENT,
        password=patient.password
    )

    user = user_service.register_user(db=db, user_dto=new_user)

    doctor_patient = DoctorPatient(doctor_id=doctor_id, patient_id=user.id)

    db.add(doctor_patient)
    db.commit()

    return UserDto.model_validate(user)


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