from typing import cast
from pydantic import UUID4

from app.exceptions import NotFoundError
from app.repositories.doctor_patient_repository import DoctorPatientRepository
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.pagination import PaginationParams
from app.schemas.pagination.paginated_list import PaginatedList


class DoctorPatientGetter:
    def __init__(self, doctor_patient_repository: DoctorPatientRepository):
        self.doctor_patient_repository = doctor_patient_repository

    async def get_patients(
        self,
        doctor_id: UUID4,
        pagination_params: PaginationParams
    ) -> PaginatedList[DoctorPatientDto]:
        """Get active doctor patients"""
        doctor_patients = await self.doctor_patient_repository.get_by_doctor_id(
            doctor_id=doctor_id,
            pagination_params=pagination_params
        )

        doctor_patients_dto = cast(
            PaginatedList[DoctorPatientDto],
            doctor_patients
        )

        doctor_patients_dto.data = [
            DoctorPatientDto.create(doctor_patient)
            for doctor_patient in doctor_patients.data
        ]

        return doctor_patients_dto

    async def get_patient(self, doctor_id: UUID4, patient_id: UUID4) -> DoctorPatientDto:
        """
        Get patient info
        :raises NotFoundError: If doctor_patient not found
        """
        doctor_patient = await self.doctor_patient_repository.get_by_doctor_id_and_patient_id(doctor_id, patient_id)

        if not doctor_patient:
            raise NotFoundError(f"DoctorPatient with doctor_id {doctor_id} and patient_id {patient_id} not found")

        return DoctorPatientDto.create(doctor_patient)
