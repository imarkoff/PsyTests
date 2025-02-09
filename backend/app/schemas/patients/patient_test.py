from datetime import datetime
from uuid import UUID

from pydantic import ConfigDict, BaseModel

from app.schemas.test.test import Test


class PatientTestDto(BaseModel):
    id: UUID
    patient_id: UUID
    assigned_by_id: UUID
    test: Test
    assigned_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "patient_id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "assigned_by_id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "test": Test.model_json_schema().get("example", {}),
                "assigned_at": "2025-01-22T19:05:29.123456"
            }
        }
    )