from datetime import datetime
from typing import Optional, Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.db.models.test_history import TestHistory
from app.schemas.test_base import TestBase


class TestResultDto(BaseModel):
    """
    Information about passed test
    """

    id: UUID
    test: TestBase
    patient_id: UUID
    results: dict[str, Any]
    verdict: Optional[dict[str, Any]] = None
    passed_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "test": TestBase.model_json_schema()["example"],
                "patient_id": "123e4567-e89b-12d3-a456-426614174000",
                "results": {
                    "_": [1, 2, 3, 4, None],
                },
                "verdict": {
                    "_": 97,
                    "raw": {"L": 0, "F": 1, "K": 0, "1": 3, "2": 3, "3": 3, "4": 2, "6": 1, "7": 3, "8": 3, "9": 1},
                    "converted": {"L": 39.0, "F": 39.28, "K": 28.0, "1": 35.0, "2": 37.45, "3": 24.19, "4": 9.67, "6": 30.47, "7": 26.28, "8": 25.58, "9": 20.47}
                },
                "passed_at": "2022-01-01T00:00:00"
            }
        }
    )

    @classmethod
    def from_test_result(cls, test_result: TestHistory, test: TestBase) -> 'TestResultDto':
        return cls(
            id=test_result.id,
            test=test,
            patient_id=test_result.patient_id,
            results=test_result.results,
            verdict=test_result.verdict,
            passed_at=test_result.passed_at
        )


class TestResultShortDto(BaseModel):
    """
    Short version of test result
    """

    id: UUID
    test_id: UUID
    test_name: str
    passed_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "test_id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "test_name": "Test name",
                "passed_at": "2022-01-01T00:00:00"
            }
        }
    )