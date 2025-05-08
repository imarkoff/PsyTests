from uuid import UUID

from app.db.models.patient_test import PatientTest
from app.exceptions import AlreadyExistsError
from app.repositories.patient_test_repository import PatientTestRepository
from app.schemas.patients.patient_test import PatientTestDto
from app.services.patients.doctor_patient_service.doctor_patient_getter import DoctorPatientGetter
from app.services.test_service import TestService


class PatientTestAssigner:
    """Responsible for assigning test to a patient"""

    def __init__(self,
                 patient_test_repository: PatientTestRepository,
                 doctor_patient_getter: DoctorPatientGetter,
                 test_service: TestService):
        self.repository = patient_test_repository
        self.doctor_patient_getter = doctor_patient_getter
        self.test_service = test_service

    async def assign_test(self, test_id: UUID, doctor_id: UUID, patient_id: UUID) -> PatientTestDto:
        """
        Assign test to patient

        Raises:
            NotFoundError: If patient test or test not found
            AlreadyExistsError: If test already assigned to client
        """

        # check if patient exists
        await self.doctor_patient_getter.get_patient(doctor_id, patient_id)

        test = await self.test_service.get_base_test(test_id)  # Check if test exists

        existing_test = await self.repository.get_assigned_test_by_test_id_and_patient_id(test_id,
                                                                                          patient_id)

        if existing_test:
            raise AlreadyExistsError

        new_patient_test = PatientTest(patient_id=patient_id, assigned_by_id=doctor_id, test_id=test_id)
        await self.repository.create_test(new_patient_test)

        return PatientTestDto.create(new_patient_test, test)
