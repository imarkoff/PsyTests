
from pydantic import BaseModel, ConfigDict, Field


class PCL5Criteria(BaseModel):
    """
    Criteria type for PCL-5 test
    """

    criteria: str     #  Criteria type
    description: str  #  A short description of the criteria
    countable: str | None = None  # questions in this criteria should count answers

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "criteria": "A",
                "description": "Опис травматичної події"
            }
        }
    )