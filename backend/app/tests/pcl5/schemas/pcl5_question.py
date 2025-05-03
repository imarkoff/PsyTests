from typing import TypeAlias, Literal

from pydantic import BaseModel, Field, ConfigDict

QuestionType: TypeAlias = Literal["input", "radio"]

class PCL5Question(BaseModel):
    id: str | None = Field(None, title="ID of the question")
    question: str
    type: QuestionType = Field("radio", title="Type of the question and how to interact with it")
    criteria: str = Field(..., title="The criteria the question belongs to")

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
              "id": "0",
              "question": "Будь ласка, коротко опишіть подію",
              "type": "input",
              "criteria": "A"
            },
        }
    )