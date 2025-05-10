from pydantic import ConfigDict

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.stai.schemas.stai_answer import STAIAnswer
from app.domains.tests.stai.schemas.stai_question import STAIQuestion
from app.domains.tests.stai.schemas.stai_scale import STAIScale


class STAITest(TestBase):
    """State-Trait Anxiety Inventory (STAI) test schema."""

    type: str = "stai"
    scales: list[STAIScale]
    answers: list[STAIAnswer]
    questions: list[STAIQuestion]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                **TestBase.model_config["json_schema_extra"]["example"],
                "scales": [
                    STAIScale.model_config["json_schema_extra"]["example"]
                ],
                "answers": [
                    STAIAnswer.model_config["json_schema_extra"]["example"]
                ],
                "questions": [
                    STAIQuestion.model_config["json_schema_extra"]["example"]
                ]
            }
        }
    )

    def get_scale(self, scale_label: str) -> STAIScale | None:
        for scale in self.scales:
            if scale.label == scale_label:
                return scale

        return None
