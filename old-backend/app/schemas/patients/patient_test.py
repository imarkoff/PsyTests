from datetime import datetime
from uuid import UUID

from pydantic import ConfigDict, BaseModel

from app.db.models.patient_test import PatientTest
from app.domains.tests.base.test_base import TestBase


class PatientTestDto(BaseModel):
    id: UUID
    patient_id: UUID
    assigned_by_id: UUID
    test: TestBase
    assigned_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "patient_id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "assigned_by_id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "test": TestBase.model_json_schema().get("example", {}),
                "assigned_at": "2025-01-22T19:05:29.123456"
            }
        }
    )

    @classmethod
    def create(cls, patient_test: PatientTest, test: TestBase) -> "PatientTestDto":
        return cls(
            id=patient_test.id,
            patient_id=patient_test.patient_id,
            assigned_by_id=patient_test.assigned_by_id,
            test=test,
            assigned_at=patient_test.assigned_at
        )
