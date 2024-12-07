from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, BeforeValidator, Field, ConfigDict
from pydantic import UUID4

PyObjectId = Annotated[str, BeforeValidator(str)]


class Answer(BaseModel):
    answer: str = Field(..., title="Answer")
    is_correct: bool = Field(..., title="Is Correct")


class Question(BaseModel):
    question: str = Field(..., title="Question")
    answers: list[Answer] = Field(..., title="Answers")
    points: int = Field(..., title="Points")


class TestDto(BaseModel):
    name: str = Field(..., title="Name")
    description: Optional[str] = Field(..., title="Description")
    questions: list[Question] = Field(..., title="Questions")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Test",
                "description": "Test description",
                "questions": [
                    {
                        "question": "Question",
                        "answers": [
                            {
                                "answer": "Answer",
                                "is_correct": True
                            }
                        ],
                        "points": 1
                    }
                ]
            }
        }
    )