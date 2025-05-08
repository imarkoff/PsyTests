from uuid import UUID

from app.exceptions import NotFoundError
from app.repositories.patient_test_repository import PatientTestRepository
from app.schemas.patients.patient_test import PatientTestDto


class PatientTestGetter:
    """Responsible for getting patient test data"""

    def __init__(self, patient_test_repository: PatientTestRepository):
        self.repository = patient_test_repository

    async def get(self, test_id: UUID) -> PatientTestDto:
        """
        :raises NotFoundError: If test not found
        """
        test = await self.repository.get_by_id(test_id)

        if test is None:
            raise NotFoundError

        return await PatientTestDto.create(test)

    async def get_patient_tests(self, patient_id: UUID) -> list[PatientTestDto]:
        tests = await self.repository.get_assigned_tests_by_patient_id(patient_id)
        return [await PatientTestDto.create(test) for test in tests]

    async def get_patient_tests_by_doctor(self, doctor_id: UUID, patient_id: UUID) -> list[PatientTestDto]:
        tests = await self.repository.get_assigned_patient_tests_by_doctor_id(doctor_id, patient_id)
        return [await PatientTestDto.create(test) for test in tests]

    async def get_patient_test(self, patient_id: UUID, test_id: UUID) -> PatientTestDto:
        """
        :raises NotFoundError: If test not found
        """
        test = await self.repository.get_test_by_patient_id(patient_id, test_id)

        if not test:
            raise NotFoundError

        return await PatientTestDto.create(test)
