from datetime import datetime
from typing import Any
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.db.models.test_history import TestHistory
from app.domains.tests.base.test_base import TestBase
from app.domains.tests.test_verdict_types import TestVerdictTypes


class TestResultDto(BaseModel):
    """
    Information about passed test
    """

    id: UUID
    test: TestBase
    results: dict[str, Any]
    verdict: TestVerdictTypes | None
    passed_at: datetime

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "test": TestBase.model_json_schema()["example"],
                "results": {
                    "_": [1, 2, 3, 4, None],
                },
                "verdict": { },
                "passed_at": "2022-01-01T00:00:00"
            }
        }
    )

    @classmethod
    def from_test_result(cls, test_result: TestHistory, test: TestBase) -> 'TestResultDto':
        return cls(
            id=test_result.id,
            test=test,
            results=test_result.results,
            verdict=test_result.verdict,
            passed_at=test_result.passed_at
        )

    def get_document_generator(self):
        from app.domains.tests.test_factories import TestFactories
        test_factory_type = TestFactories().get_factory_or_default(self.test.type)
        test_service = test_factory_type().get_service(self.test)
        return test_service.get_document_generator()


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

    @classmethod
    def from_test_result(cls, test_result: TestHistory, test: TestBase) -> 'TestResultShortDto':
        return cls(
            id=test_result.id,
            test_id=test.id,
            test_name=test.name,
            passed_at=test_result.passed_at
        )
