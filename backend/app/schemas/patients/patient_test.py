from datetime import datetime
from typing import Type, cast
from uuid import UUID

from pydantic import ConfigDict, BaseModel

from app.db.models.patient_test import PatientTest
from app.schemas.test.test import Test
from app.services import tests_service


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

    @classmethod
    async def create(cls, patient_test: PatientTest | Type[PatientTest], show_correct_answers: bool = False):
        if isinstance(patient_test, type):
            patient_test = cast(PatientTest, patient_test)

        test = await tests_service.get_test(patient_test.test_id, show_correct_answers)
        return cls(
            id=patient_test.id,
            patient_id=patient_test.patient_id,
            assigned_by_id=patient_test.assigned_by_id,
            test=test,
            assigned_at=patient_test.assigned_at
        )