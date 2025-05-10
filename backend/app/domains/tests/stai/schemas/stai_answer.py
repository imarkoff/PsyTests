from pydantic import BaseModel, ConfigDict


class STAIAnswer(BaseModel):
    name: str
    mark: int | None  # None for hidden answers

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Майже ніколи",
                "mark": 2
            }
        }
    )
