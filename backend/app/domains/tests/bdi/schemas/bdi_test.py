from pydantic import ConfigDict

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.bdi.schemas.bdi_question import BDIQuestion


class BDITest(TestBase):
    type: str = "bdi"
    questions: list[BDIQuestion]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                **TestBase.model_config["json_schema_extra"]["example"],
                "questions": [
                    BDIQuestion.model_config["json_schema_extra"]["example"],
                ]
            }
        }
    )
