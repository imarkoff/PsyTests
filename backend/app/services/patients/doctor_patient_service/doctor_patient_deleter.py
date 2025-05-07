from uuid import UUID

from app.exceptions import NotFoundError
from app.repositories.doctor_patient_repository import DoctorPatientRepository
from app.services.patients.patient_test_service.patient_test_unassigner import PatientTestUnassigner


class DoctorPatientDeleter:
    def __init__(self,
                 doctor_patient_repository: DoctorPatientRepository,
                 patient_test_unassigner: PatientTestUnassigner):
        self.doctor_patient_repository = doctor_patient_repository
        self.patient_test_unassigner = patient_test_unassigner

    async def delete_patient(self, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Delete patient from doctor patients
        :raises NotFoundError: If doctor_patient not found
        """

        doctor_patient = await self.doctor_patient_repository.get_by_doctor_id_and_patient_id(doctor_id, patient_id)

        if doctor_patient:
            await self.patient_test_unassigner.unassign_doctor_tests(doctor_id, patient_id)
            await self.doctor_patient_repository.delete_doctor_patient(doctor_patient)
        else:
            raise NotFoundError
