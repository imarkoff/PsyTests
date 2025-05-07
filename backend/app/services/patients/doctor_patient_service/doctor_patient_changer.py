from uuid import UUID

from app.repositories.doctor_patient_repository import DoctorPatientRepository


class DoctorPatientChanger:
    def __init__(self, doctor_patient_repository: DoctorPatientRepository):
        self.doctor_patient_repository = doctor_patient_repository

    async def change_attention(self, patient_id: UUID, needs_attention: bool) -> None:
        """Change patient needs attention status"""
        await self.doctor_patient_repository.change_attention(patient_id, needs_attention)

    async def change_status(self, patient_id: UUID, is_active: bool) -> None:
        """Change patient status"""
        await self.doctor_patient_repository.change_status(patient_id, is_active)