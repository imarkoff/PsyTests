from pydantic import BaseModel, ConfigDict


class BDIVerdict(BaseModel):
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
