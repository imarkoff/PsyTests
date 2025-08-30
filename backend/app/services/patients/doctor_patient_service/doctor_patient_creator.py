from uuid import UUID
from pydantic import UUID4

from app.db.models.doctor_patient import DoctorPatient
from app.exceptions import AlreadyExistsError
from app.repositories.doctor_patient_repository import DoctorPatientRepository
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.patients.patient_create import PatientCreateDto
from app.schemas.role import Role
from app.schemas.user_auth import UserCreate
from app.services.user_service import UserService


class DoctorPatientCreator:
    def __init__(self, doctor_patient_repository: DoctorPatientRepository, user_service: UserService):
        self.doctor_patient_repository = doctor_patient_repository
        self.user_service = user_service

    async def assign_patient(self, doctor_id: UUID4, patient_id: UUID4) -> DoctorPatientDto:
        """
        Add patient to doctor patients
        :raises AlreadyExistsError: If doctor_patient already exists
        """

        existing_doctor_patient = await self.doctor_patient_repository.get_by_doctor_id_and_patient_id(doctor_id, patient_id)

        if existing_doctor_patient:
            raise AlreadyExistsError

        doctor_patient = await self._create_doctor_patient(doctor_id, patient_id)
        return DoctorPatientDto.create(doctor_patient)

    async def _create_doctor_patient(self, doctor_id: UUID4, patient_id: UUID4):
        doctor_patient = DoctorPatient(doctor_id=doctor_id, patient_id=patient_id)
        await self.doctor_patient_repository.create_doctor_patient(doctor_patient)
        return doctor_patient

    async def create_patient(self, doctor_id: UUID, patient: PatientCreateDto) -> DoctorPatientDto:
        """
        Create new patient and add to doctor patients
        :raises AlreadyExistsError: If patient already exists
        """

        new_user = UserCreate(
            name=patient.name,
            surname=patient.surname,
            patronymic=patient.patronymic,
            gender=patient.gender,
            birth_date=patient.birth_date,
            phone=patient.phone,
            role=Role.PATIENT,
            password=patient.password
        )

        user = await self.user_service.register_user(new_user, registered_by_id=doctor_id)

        doctor_patient = await self._create_doctor_patient(doctor_id, patient_id=user.id)
        return DoctorPatientDto.create(doctor_patient)
