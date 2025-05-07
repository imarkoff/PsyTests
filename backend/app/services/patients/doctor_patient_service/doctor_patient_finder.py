from pydantic import UUID4

from app.repositories.doctor_patient_repository import DoctorPatientRepository
from app.schemas.patients.patient_search_dto import PatientSearchDto
from app.services.user_service import UserService


class DoctorPatientFinder:
    def __init__(self, doctor_patient_repository: DoctorPatientRepository, user_service: UserService):
        self.doctor_patient_repository = doctor_patient_repository
        self.user_service = user_service

    async def find_patient(self, doctor_id: UUID4, search: str) -> PatientSearchDto:
        """
        Find patient in database by search.
        Also sort patients by doctor patients and other patients
        """

        patients = await self.user_service.get_patients_by_data(search)
        doctor_patients = await self.doctor_patient_repository.get_by_patient_id_list(
            doctor_id=doctor_id,
            patients=[patient.id for patient in patients]
        )

        doctor_patient_ids = {doctor_patient.patient_id for doctor_patient in doctor_patients}
        other_patients = [patient for patient in patients if patient.id not in doctor_patient_ids]

        return PatientSearchDto.create(doctor_patients, other_patients)
