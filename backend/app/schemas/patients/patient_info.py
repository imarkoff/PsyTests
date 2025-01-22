from pydantic import BaseModel

from app.schemas.patients.patient_test import PatientTestDto
from app.schemas.user_auth import UserDto


class PatientInfoDto(BaseModel):
    patient: UserDto
    tests: list[PatientTestDto]