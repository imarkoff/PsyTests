from typing import Optional

from pydantic import BaseModel, ConfigDict

from app.domains.tests.raven.schemas.question import Question


class TestModule(BaseModel):
    name: str
    path: str
    description: Optional[str] = None
    questions: list[Question]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "name": "Module",
                "path": "./relative/path/to/module",
                "description": "Module description",  # optional
                "questions": [  # must contain image or question text
                    Question.model_config.get("example", {})
                ]
            }
        }
    )