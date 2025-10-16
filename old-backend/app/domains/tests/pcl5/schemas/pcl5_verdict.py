from pydantic import ConfigDict

from app.domains.tests.base.test_verdict import TestVerdict


class PCL5Verdict(TestVerdict):
    counts: dict[str, int]
    verdict: str | None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "counts": {
                    "B": 5,
                    "C": 10
                },
                "verdict": "Посттравматичний розлад малоймовірний"
            }
        }
    )
