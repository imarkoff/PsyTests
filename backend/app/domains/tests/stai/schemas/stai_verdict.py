from pydantic import BaseModel, ConfigDict


class STAIVerdict(BaseModel):
    score: list['STAIScaleScore']
    verdicts: list['STAIScaleVerdict']


class STAIScaleScore(BaseModel):
    scale_label: str
    negative: int
    positive: int
    converted_score: int

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "scale_label": "CT",
                "negative": 10,
                "positive": 15,
                "converted_score": 45,
            }
        }
    )


class STAIScaleVerdict(BaseModel):
    scale_label: str
    mark: str | None
    verdict: str | None

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "scale_label": "СТ",
                "mark": "Висока",
                "verdict": "Потрібно пробудження активності, підкреслення мотиваційних компонентів діяльності..."
            }
        }
    )
