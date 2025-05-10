from pydantic import ConfigDict

from app.domains.tests.base.test_verdict import TestVerdict
from app.domains.tests.raven.schemas.test_history_results import RavenTestResults


class RavenVerdict(TestVerdict):
    results: RavenTestResults
    verdict: str | None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "results": RavenTestResults.model_json_schema()["example"],
                "verdict": "Затримка психічного розвитку"
            }
        }
    )
