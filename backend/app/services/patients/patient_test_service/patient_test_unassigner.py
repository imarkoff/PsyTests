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

        await self.unassign_test(test_id, doctor_id, patient_id)

    async def unassign_doctor_tests(self, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Unassign all tests assigned by a doctor from patient
        """
        await self.repository.unassign_patient_tests_assigned_by_doctor(doctor_id, patient_id)
