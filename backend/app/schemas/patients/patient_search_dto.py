from typing import Type

from pydantic import BaseModel

from app.db.models.doctor_patient import DoctorPatient
from app.db.models.test_history import User
from app.schemas.doctor_patient_dto import DoctorPatientDto
from app.schemas.user import UserDto


class PatientSearchDto(BaseModel):
    """
    Search patients response
    """

    doctor_patients: list[DoctorPatientDto]
    patients: list[UserDto]

    @classmethod
    def create(
            cls,
            doctor_patients: list[DoctorPatient] | list[Type[DoctorPatient]],
            patients: list[User] | list[Type[User]]
    ) -> "PatientSearchDto":
        dto_doctor_patients = [DoctorPatientDto.create(doctor_patient) for doctor_patient in doctor_patients]
        dto_patients = [UserDto.create(patient) for patient in patients]

        return cls(doctor_patients=dto_doctor_patients, patients=dto_patients)