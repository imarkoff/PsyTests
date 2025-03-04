from typing import Optional

from pydantic import Field, ConfigDict

from app.utils.tests.raven.question import Question
from app.schemas.test.test_module import TestModule
from app.schemas.test_base import TestBase
from app.utils.tests.raven.test_includes import get_test_module


class RavenTest(TestBase):
    modules: Optional[list[TestModule]] = Field(None, title="Modules")
    questions: Optional[list[Question]] = Field(..., title="Questions")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                **TestBase.model_config.get("example", {}),
                "modules": [
                    TestModule.model_config.get("example", {})
                ],
                "description": "Test description",
                "questions": [  # must contain image or question text
                    Question.model_config.get("example", {})
                ],
            }
        }
    )

    @classmethod
    def from_json(cls, test_data: dict) -> 'RavenTest':
        test_id = test_data.get("id")

        return cls(
            id=test_id,
            name=test_data.get("name"),
            type=test_data.get("type"),
            modules=[get_test_module(test_id, module) for module in test_data.get('modules', [])],
            description=test_data.get("description", None),
            questions=[Question.from_json(question_data) for question_data in test_data.get("questions", [])],
            marks_path=test_data.get("marks", None),
            marks_unit=test_data.get("marks_unit", None)
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