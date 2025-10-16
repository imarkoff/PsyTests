from typing import cast
from uuid import UUID

from app.db.models.patient_test import PatientTest
from app.exceptions import NotFoundError
from app.repositories.patient_test_repository import PatientTestRepository
from app.schemas.pagination import PaginatedList, PaginationParams
from app.schemas.patients.patient_test import PatientTestDto
from app.services.test_service import TestService


class PatientTestGetter:
    """Responsible for getting patient test data"""

    def __init__(self, patient_test_repository: PatientTestRepository, test_service: TestService):
        self.repository = patient_test_repository
        self.test_service = test_service

    async def get(self, test_id: UUID) -> PatientTestDto:
        """
        Get patient test by id
        :raises NotFoundError: If test not found
        """
        patient_test = await self.repository.get_by_id(test_id)

        if patient_test is None:
            raise NotFoundError(f"Patient test with ID {test_id} not found")

        return await self._patient_test_to_dto(patient_test)

    async def get_patient_tests(self, patient_id: UUID) -> list[PatientTestDto]:
        """Get all tests assigned to a patient"""
        patient_tests = await self.repository.get_assigned_tests_by_patient_id(patient_id)
        return [await self._patient_test_to_dto(test) for test in patient_tests]

    async def get_patient_tests_by_doctor(
        self,
        doctor_id: UUID,
        pagination_params: PaginationParams
    ) -> PaginatedList[PatientTestDto]:
        """Get all tests assigned by a specific doctor"""

        patient_tests = await self.repository.get_assigned_tests_by_doctor_id(
            doctor_id=doctor_id,
            pagination_params=pagination_params
        )

        patient_tests_dtos = cast(PaginatedList[PatientTestDto], patient_tests)
        patient_tests_dtos.data = [
            await self._patient_test_to_dto(test)
            for test in patient_tests.data
        ]

        return patient_tests_dtos

    async def get_patient_tests_by_doctor_and_patient(self, doctor_id: UUID, patient_id: UUID) -> list[PatientTestDto]:
        """Get all tests assigned to a patient by a specific doctor"""
        patient_tests = await self.repository.get_assigned_patient_tests_by_doctor_id(doctor_id, patient_id)
        return [await self._patient_test_to_dto(test) for test in patient_tests]

    async def get_patient_test(self, patient_id: UUID, test_id: UUID) -> PatientTestDto:
        """
        Get a specific test related with a patient
        :raises NotFoundError: If test not found
        """
        patient_test = await self.repository.get_test_by_patient_id(patient_id, test_id)

        if patient_test is None:
            raise NotFoundError(f"Patient test with ID {test_id} not found for patient {patient_id}")

        return await self._patient_test_to_dto(patient_test)

    async def _patient_test_to_dto(self, patient_test: PatientTest) -> PatientTestDto:
        test = await self.test_service.get_base_test(patient_test.test_id)
        return PatientTestDto.create(patient_test, test)
