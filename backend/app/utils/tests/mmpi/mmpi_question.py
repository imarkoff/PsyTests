from pydantic import BaseModel, ConfigDict


class MMPIAnswer(BaseModel):
    scales: list[str]
    answer: bool


class MMPIQuestion(BaseModel):
    id: str
    question: str
    answers: list[MMPIAnswer]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "1",
                "question": "I like to go to parties",
                "answers": [
                    {
                        "scales": ["0"],
                        "answer": True
                    }
                ]
            }
        }
    )