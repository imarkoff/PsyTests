from pydantic import BaseModel, ConfigDict, UUID4

from app.schemas.test_base import TestBase


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


class MMPIScale(BaseModel):
    label: str
    abbrev: str | None = None
    name: str

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "label": "0",
                "abbrev": "Si",
                "name": "Social introversion"
            }
        }
    )


class MMPITest(TestBase):
    id: UUID4
    name: str
    type: str = "mmpi"
    scales: list[MMPIScale]
    description: str | None = None
    questions: list[MMPIQuestion]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                **TestBase.model_json_schema()["example"],
                "type": "mmpi",
                "scales": [
                    MMPIScale.model_json_schema()["example"]
                ],
            }
        }
    )

    @classmethod
    def from_json(cls, test_data: dict) -> 'MMPITest':
        return cls(
            id=test_data.get("id"),
            name=test_data.get("name"),
            scales=[MMPIScale(**scale_data) for scale_data in test_data.get('scales', [])],
            description=test_data.get("description", None),
            questions=[MMPIQuestion(**question_data) for question_data in test_data.get("questions", [])]
        )

    def hide_correct_answers(self):
        for question in self.questions:
            question.answers = []