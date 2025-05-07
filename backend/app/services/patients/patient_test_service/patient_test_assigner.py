from uuid import UUID

from app.db.models.patient_test import PatientTest
from app.exceptions import AlreadyExistsError
from app.repositories.patient_test_repository import PatientTestRepository
from app.schemas.patients.patient_test import PatientTestDto
from app.services.patients.doctor_patient_service.doctor_patient_getter import DoctorPatientGetter
from app.services.tests_service import get_test


class PatientTestAssigner:
    """Responsible for assigning test to a patient"""

    def __init__(self, patient_test_repository: PatientTestRepository, doctor_patient_getter: DoctorPatientGetter):
        self.repository = patient_test_repository
        self.doctor_patient_getter = doctor_patient_getter

    async def assign_test(self, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> PatientTestDto:
        """
        Assign test to patient

        Raises:
            FileNotFoundError: If test not found
            NotFoundError: If patient not found
            AlreadyExistsError: If test already assigned to client
        """

        # check if patient exists
        await self.doctor_patient_getter.get_patient(doctor_id, patient_id)

        await get_test(test_id)  # Check if test exists

        existing_test = await self.repository.get_assigned_test_by_test_id_and_patient_id(test_id,
                                                                                          patient_id)

        if existing_test:
            raise AlreadyExistsError

        new_test = PatientTest(patient_id=patient_id, assigned_by_id=doctor_id, test_id=test_id)
        await self.repository.create_test(new_test)

        return await PatientTestDto.create(new_test)
