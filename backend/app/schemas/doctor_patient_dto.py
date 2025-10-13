from datetime import datetime
from typing import Type, cast
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.db.models.doctor_patient import DoctorPatient
from app.schemas.user import UserDto


class DoctorPatientDto(BaseModel):
    """
    Representation of doctor related patient
    """

    id: UUID
    patient: UserDto
    assigned_at: datetime
    unassigned_at: datetime | None
    needs_attention: bool

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "123e4567-e89b-12d3-a456-426614174000",
                "patient": UserDto.model_json_schema().get("example"),
                "assigned_at": "2021-07-06T13:00:00",
                "unassigned_at": None,
                "needs_attention": False
            }
        }
    )

    @classmethod
    def create(cls, doctor_patient: DoctorPatient | Type[DoctorPatient]):
        if isinstance(doctor_patient, type):
            doctor_patient = cast(DoctorPatient, doctor_patient)

        return cls(
            id=doctor_patient.id,
            patient=UserDto.create(doctor_patient.patient),
            assigned_at=doctor_patient.assigned_at,
            unassigned_at=doctor_patient.unassigned_at,
            needs_attention=doctor_patient.needs_attention
        )
