from typing import Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

from app.schemas.test.test_marks import Marks


class TestShortDto(BaseModel):
    """
    Shortened test model
    """

    id: UUID
    name: str
    description: Optional[str]
    marks: Optional[Marks]
    questions_count: int

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "name": "IQ test",
                "description": "Test for measuring intelligence",
                "marks": {
                    "_": "Each mark means range of points percentage. "
                         "Example: 25-75 (75 is inclusive): Intermediate intelligence",
                    "5": "Low intelligence",
                    "25": "Below average intelligence",
                    "75": "Intermediate intelligence",
                    "95": "Upper intermediate intelligence",
                    "100": "High intelligence"
                },
                "questions_count": 10
            }
        }
    )