from uuid import UUID

from app.schemas.pagination import PaginationParams
from app.schemas.patients.patient_test import PatientTestDto
from app.services.patients.patient_test_service.patient_test_assigner import PatientTestAssigner
from app.services.patients.patient_test_service.patient_test_getter import PatientTestGetter
from app.services.patients.patient_test_service.patient_test_unassigner import PatientTestUnassigner


class PatientTestService:
    """Service for managing patient test related business logic"""

    def __init__(self,
                 patient_test_assigner: PatientTestAssigner,
                 patient_test_getter: PatientTestGetter,
                 patient_test_unassigner: PatientTestUnassigner):
        self.assigner = patient_test_assigner
        self.getter = patient_test_getter
        self.unassigner = patient_test_unassigner

    async def assign_test(self, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> PatientTestDto:
        """
        Assign test to patient

        Raises:
            NotFoundError: If patient or test not found
            AlreadyExistsError: If test already assigned to client
        """
        return await self.assigner.assign_test(test_id, doctor_id, patient_id)

    async def get_patient_tests(self, patient_id: UUID) -> list[PatientTestDto]:
        return await self.getter.get_patient_tests(patient_id)

    async def get_patient_tests_by_doctor(self, doctor_id: UUID, pagination_params: PaginationParams) -> list[PatientTestDto]:
        """Get all tests assigned by a specific doctor"""
        return await self.getter.get_patient_tests_by_doctor(doctor_id, pagination_params)

    async def get_patient_tests_by_doctor_and_patient(self, doctor_id: UUID, patient_id: UUID) -> list[PatientTestDto]:
        return await self.getter.get_patient_tests_by_doctor_and_patient(doctor_id, patient_id)

    async def get_patient_test(self, patient_id: UUID, test_id: UUID) -> PatientTestDto:
        """
        :raises NotFoundError: If test not found
        """
        return await self.getter.get_patient_test(patient_id, test_id)

    async def unassign_test(self, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Unassign test from patient
        :raises NotFoundError: If test not found
        """
        return await self.unassigner.unassign_test(test_id, doctor_id, patient_id)

    async def unassign_doctor_tests(self, doctor_id: UUID, patient_id: UUID) -> None:
        """
        Unassign all tests assigned by a doctor from patient
        """
        return await self.unassign_doctor_tests(doctor_id, patient_id)
