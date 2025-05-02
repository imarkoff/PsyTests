from pydantic import BaseModel, ConfigDict, UUID4


class TestBase(BaseModel):
    """
    Base test model. Also used for showing base test information.
    Should be inherited by all test models.
    """

    id: UUID4
    name: str
    type: str  # Type of the test. Based on this field, the test class will be selected
    description: str | None = None
    marks_path: str | None = None
    marks_unit: str | None = None  # marks measurement unit

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "name": "IQ test",
                "type": "raven",
                "description": "Test for measuring intelligence",
                "marks_path": "marks.csv",
                "marks_unit": "IQ"
            }
        }
    )