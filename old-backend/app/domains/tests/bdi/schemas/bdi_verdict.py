from pydantic import ConfigDict

from app.domains.tests.base.test_verdict import TestVerdict


class BDIVerdict(TestVerdict):
    total_score: int
    verdict: str | None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "total_score": 10,
                "verdict": "легка депресія (субдепресія)"
            }
        }
    )

