from datetime import datetime
from uuid import UUID

from pydantic import ConfigDict, BaseModel

from app.schemas.test import Test


class PatientTestDto(BaseModel):
    id: UUID
    patient_id: UUID
    assigned_by_id: UUID
    test: Test
    assigned_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
    )