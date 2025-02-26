from typing import Optional

from pydantic import BaseModel, Field, ConfigDict, UUID4

from app.schemas.test.question import Question
from app.schemas.test.test_marks import Marks
from app.schemas.test.test_module import TestModule


class Test(BaseModel):
    id: UUID4 = Field(..., title="ID")
    name: str = Field(..., title="Name")
    modules: Optional[list[TestModule]] = Field(None, title="Modules")
    description: Optional[str] = Field(None, title="Description")
    questions: Optional[list[Question]] = Field(..., title="Questions")
    marks: Optional[Marks] = Field(None, title="Marks")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "f3847ce2-553a-422b-a2ac-57910619cb6d",
                "name": "Test",
                "modules": [
                    TestModule.model_config.get("example", {})
                ],
                "description": "Test description",  # optional
                "questions": [  # must contain image or question text
                    Question.model_config.get("example", {})
                ],
                "marks": {
                    "_": "Each mark means range of points percentage. "
                         "Example: 25-75 (75 is inclusive): Intermediate intelligence",
                    "5": "Low intelligence",
                    "25": "Below average intelligence",
                    "75": "Intermediate intelligence",
                    "95": "Upper intermediate intelligence",
                    "100": "High intelligence"
                }
            }
        }
    )

    def get_module(self, module_name: str) -> TestModule | None:
        """
        Get module by name
        """

        for module in self.modules:
            if module.name == module_name:
                return module
        return None

    def hide_correct_answers(self):
        """
        Hide correct answers
        """

        if self.questions:
            for question in self.questions:
                for answer in question.answers:
                    answer.is_correct = False

        for module in self.modules:
            for question in module.questions:
                for answer in question.answers:
                    answer.is_correct = False