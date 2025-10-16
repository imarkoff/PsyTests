from uuid import UUID

from app.exceptions import NotFoundError
from app.repositories.patient_test_repository import PatientTestRepository


class PatientTestUnassigner:
    """Responsible for unassigning patient test data"""

    def __init__(self, patient_test_repository: PatientTestRepository):
        self.repository = patient_test_repository

    async def unassign_test(self, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Unassign test from patient
        :raises NotFoundError: If test not found
        """

        test = await self.repository.get_test_by_doctor_id_and_patient_id(test_id, doctor_id, patient_id)

        if not test:
            raise NotFoundError

        await self.repository.unassign_test(test)

    async def unassign_tests_by_doctor_and_patient(self, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Unassign all tests assigned by a doctor from patient
        """
        await self.repository.unassign_patient_tests_assigned_by_doctor(doctor_id, patient_id)

    async def unassign_tests_by_patient(self, patient_id: UUID) -> None:
        """
        Unassign all tests from patient
        """
        await self.repository.unassign_tests_by_patient(patient_id)

    async def unassign_tests_by_doctor(self, doctor_id: UUID) -> None:
        """
        Unassign all tests assigned by a doctor from all patients
        """
        await self.repository.unassign_tests_by_doctor(doctor_id)
