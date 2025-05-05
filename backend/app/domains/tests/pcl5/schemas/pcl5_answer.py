from pydantic import BaseModel, Field, ConfigDict


class PCL5Answer(BaseModel):
    answer: str = Field(..., title="A typical answer to the question")
    mark: int = Field(..., title="The mark of the answer")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "answer": "Відчутно",
                "mark": 3,
            }
        }
    )