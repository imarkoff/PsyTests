from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.test.test_history_results import Results
from app.schemas.test_short import TestShortDto


class TestResultDto(BaseModel):
    """
    Information about passed test
    """

    id: UUID
    test: TestShortDto
    patient_id: UUID
    results: Results
    verdict: Optional[str] = None
    passed_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "test": TestShortDto.model_json_schema()["example"],
                "patient_id": "123e4567-e89b-12d3-a456-426614174000",
                "results": Results.model_json_schema()["example"],
                "passed_at": "2022-01-01T00:00:00"
            }
        }
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