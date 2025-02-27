from typing import Optional

from pydantic import BaseModel, ConfigDict, UUID4, Field


class TestBase(BaseModel):
    """
    Base test model
    """

    id: UUID4 = Field(..., title="ID")
    name: str = Field(..., title="Name")
    description: Optional[str] = Field(None, title="Description")
    marks_path: Optional[str] = Field(None, title="Marks path")
    marks_unit: Optional[str] = Field(None, title="Measurement unit")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "name": "IQ test",
                "description": "Test for measuring intelligence",
                "marks_path": "marks.csv",
                "marks_unit": "IQ"
            }
        }
    )

    @classmethod
    def from_json(cls, test_data: dict) -> 'TestBase':
        return cls(
            id=test_data.get("id"),
            name=test_data.get("name"),
            description=test_data.get("description", None),
            marks_path=test_data.get("marks", None),
            marks_unit=test_data.get("marks_unit", None)
        )