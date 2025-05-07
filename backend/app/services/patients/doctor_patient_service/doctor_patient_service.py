from uuid import UUID
from warnings import deprecated

from pydantic import UUID4
from sqlalchemy.orm import Session

from app.db.models.doctor_patient import DoctorPatient
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.patients.patient_create import PatientCreateDto
from app.schemas.patients.patient_search_dto import PatientSearchDto
from app.services.patients.doctor_patient_service.doctor_patient_changer import DoctorPatientChanger
from app.services.patients.doctor_patient_service.doctor_patient_creator import DoctorPatientCreator
from app.services.patients.doctor_patient_service.doctor_patient_deleter import DoctorPatientDeleter
from app.services.patients.doctor_patient_service.doctor_patient_finder import DoctorPatientFinder
from app.services.patients.doctor_patient_service.doctor_patient_getter import DoctorPatientGetter


class DoctorPatientService:
    """Service for managing doctor patients"""

    def __init__(self,
                 doctor_patient_getter: DoctorPatientGetter,
                 doctor_patient_finder: DoctorPatientFinder,
                 doctor_patient_creator: DoctorPatientCreator,
                 doctor_patient_changer: DoctorPatientChanger,
                 doctor_patient_deleter: DoctorPatientDeleter):
        self.getter = doctor_patient_getter
        self.finder = doctor_patient_finder
        self.creator = doctor_patient_creator
        self.changer = doctor_patient_changer
        self.deleter = doctor_patient_deleter

    async def get_patients(self, doctor_id: UUID4) -> list[DoctorPatientDto]:
        """Get active doctor patients"""
        return await self.getter.get_patients(doctor_id)

    async def get_patient(self, doctor_id: UUID4, patient_id: UUID4) -> DoctorPatientDto:
        """
        Get patient info
        :raises NotFoundError: If doctor_patient not found
        """
        return await self.getter.get_patient(doctor_id, patient_id)

    async def find_patient(self, doctor_id: UUID4, search: str) -> PatientSearchDto:
        """
        Find patient in database by search.
        Also sort patients by doctor patients and other patients
        """
        return await self.finder.find_patient(doctor_id, search)

    async def assign_patient(self, doctor_id: UUID4, patient_id: UUID4) -> DoctorPatientDto:
        """
        Add patient to doctor patients
        :raises AlreadyExistsError: If doctor_patient already exists
        """
        return await self.creator.assign_patient(doctor_id, patient_id)

    async def create_patient(self, doctor_id: UUID4, patient: PatientCreateDto) -> DoctorPatientDto:
        """
        Create new patient and add to doctor patients
        :raises AlreadyExistsError: If patient already exists
        """
        return await self.creator.create_patient(doctor_id, patient)

    async def change_attention(self, patient_id: UUID, needs_attention: bool) -> None:
        """Change patient needs attention status"""
        return await self.changer.change_attention(patient_id, needs_attention)

    async def change_status(self, patient_id: UUID, is_active: bool) -> None:
        """Change patient status"""
        return await self.changer.change_status(patient_id, is_active)

    async def delete_patient(self, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Delete patient from doctor patients
        :raises NotFoundError: If doctor_patient not found
        """
        return await self.deleter.delete_patient(doctor_id, patient_id)


@deprecated("Use DoctorPatientService.change_attention instead")
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
