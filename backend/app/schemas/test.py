from typing import Optional, ClassVar

from pydantic import BaseModel, Field, ConfigDict, UUID4


class Answer(BaseModel):
    answer: Optional[str] = Field(None, title="Answer")
    image: Optional[str] = Field(None, title="Image")
    is_correct: Optional[bool] = Field(False, title="Is Correct")


class Question(BaseModel):
    question: Optional[str] = Field(None, title="Question")
    image: Optional[str] = Field(None, title="Image")
    answers: list[Answer] = Field(..., title="Answers")
    points: Optional[int] = Field(1, title="Points")


class Test(BaseModel):
    id: UUID4 = Field(..., title="ID")
    name: str = Field(..., title="Name")
    description: Optional[str] = Field(None, title="Description")
    questions: list[Question] = Field(..., title="Questions")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "name": "Test",
                "description": "Test description",  # optional
                "questions": [  # must contain image or question text
                    {
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
                ]
            }
        }
    )
