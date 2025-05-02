from typing import Optional

from pydantic import Field, ConfigDict

from app.tests.raven.question import Question
from app.schemas.test.test_module import TestModule
from app.schemas.test_base import TestBase


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

    def get_module(self, module_name: str) -> TestModule | None:
        """
        Get module by name
        """

        for module in self.modules:
            if module.name == module_name:
                return module
        return None