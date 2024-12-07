from datetime import datetime
from typing import Annotated, Optional

from pydantic import BaseModel, BeforeValidator, Field, ConfigDict
from pydantic import UUID4

PyObjectId = Annotated[str, BeforeValidator(str)]


class Answer(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", title="ID", default=None)
    answer: str = Field(..., title="Answer")
    is_correct: bool = Field(..., title="Is Correct")


class Question(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", title="ID", default=None)
    question: str = Field(..., title="Question")
    answers: list[Answer] = Field(..., title="Answers")
    points: int = Field(..., title="Points")


class TestModel(BaseModel):
    id: Optional[PyObjectId] = Field(alias="_id", title="ID", default=None)
    name: str = Field(..., title="Name")
    description: Optional[str] = Field(title="Description", default=None)
    owner: UUID4 = Field(..., title="Owner ID")
    questions: list[Question] = Field(..., title="Questions")
    created_at: datetime = Field(..., title="Created At")
    updated_at: Optional[datetime] = Field(title="Updated At", default=None)

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Test",
                "description": "Test description",
                "owner": "550e8400-e29b-41d4-a716-446655440000",
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