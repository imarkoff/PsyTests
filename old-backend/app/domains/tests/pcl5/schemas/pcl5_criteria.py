
from pydantic import BaseModel, ConfigDict


class PCL5Criteria(BaseModel):
    """
    Criteria type for PCL-5 test
    """

    criteria: str     #  Criteria type
    description: str  #  A short description of the criteria
    countable: bool = False  # questions in this criteria should count answers

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "criteria": "A",
                "description": "Опис травматичної події"
            }
        }
    )