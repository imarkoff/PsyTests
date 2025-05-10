from typing import Literal

from pydantic import BaseModel, ConfigDict


ScoringType = Literal["negative", "positive"]


class STAIQuestion(BaseModel):
    id: str
    question: str
    scale: str | None  # None for hiding details for a patient
    scoring_type: ScoringType | None  # None for hiding details for a patient

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "1",
                "question": "Я спокійний",
                "scale": "CT",
                "scoring_type": "negative"
            }
        }
    )
