from pydantic import BaseModel, ConfigDict


class STAIScale(BaseModel):
    label: str
    name: str
    score_adjustment: int

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "label": "CT",
                "name": "Шкала ситуативної тривожності",
                "score_adjustment": 50,
            }
        }
    )
