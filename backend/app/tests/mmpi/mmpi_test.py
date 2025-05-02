from pydantic import ConfigDict, UUID4

from app.schemas.test_base import TestBase
from app.tests.mmpi.schemas.mmpi_question import MMPIQuestion
from app.tests.mmpi.schemas.mmpi_scale import MMPIScale


class MMPITest(TestBase):
    id: UUID4
    name: str
    type: str = "mmpi"
    scales: list[MMPIScale]
    description: str | None = None
    questions: list[MMPIQuestion]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                **TestBase.model_json_schema()["example"],
                "type": "mmpi",
                "scales": [
                    MMPIScale.model_json_schema()["example"]
                ],
            }
        }
    )
