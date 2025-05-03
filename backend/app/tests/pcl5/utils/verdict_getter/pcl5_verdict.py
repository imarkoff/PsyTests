from pydantic import BaseModel, ConfigDict


class PCL5Verdict(BaseModel):
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