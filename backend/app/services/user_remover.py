from uuid import UUID

from app.exceptions import NotFoundError
from app.services.patients.patient_test_service import PatientTestUnassigner
from app.services.user_service import UserService


class UserRemover:
    def __init__(
        self,
        patient_test_unassigner: PatientTestUnassigner,
        user_service: UserService
    ):
        self.patient_test_unassigner = patient_test_unassigner
        self.user_service = user_service

    async def remove_user(self, user_id: UUID):
        """
        Remove user by id
        :raises NotFoundError: If user not found
        """
        user = await self.user_service.get_user_by_id(user_id)

        if not user:
            raise NotFoundError(f"User with id {user_id} not found")

        if user.role == "patient":
            await self._remove_patient(user_id)
        elif user.role == "doctor":
            await self._remove_doctor(user_id)

        await self.user_service.delete_user(user)

    async def _remove_patient(self, patient_id: UUID):
        await self.patient_test_unassigner.unassign_tests_by_patient(
            patient_id=patient_id
        )

    async def _remove_doctor(self, doctor_id: UUID):
        await self.patient_test_unassigner.unassign_tests_by_doctor(
            doctor_id=doctor_id
        )
