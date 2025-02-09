from typing import Optional

from pydantic import BaseModel, Field, ConfigDict


class Answer(BaseModel):
    answer: Optional[str] = Field(None, title="Answer")
    image: Optional[str] = Field(None, title="Image")
    is_correct: Optional[bool] = Field(False, title="Is Correct")


class Question(BaseModel):
    question: Optional[str] = Field(None, title="Question")
    image: Optional[str] = Field(None, title="Image")
    answers: list[Answer] = Field(..., title="Answers")
    points: Optional[int] = Field(1, title="Points")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "question": "Question",
                "image": "./relative/path/to/image.jpg",
                "answers": [  # must contain image or answer text. at least one correct answer
                    {
                        "answer": "Answer",
                        "image": "./relative/path/to/image.jpg",
                        "is_correct": True  # optional
                    }
                ],
                "points": 1  # optional
            }
        }
    )