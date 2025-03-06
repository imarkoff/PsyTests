from typing import Optional

from pydantic import BaseModel, ConfigDict


class MMPIMultiplier(BaseModel):
    scale: str
    multiplier: float

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "scale": "K",
                "multiplier": 0.5
            }
        }
    )


class MMPIScale(BaseModel):
    label: str
    abbrev: str | None = None
    name: str
    min: int = 0
    max: int = 110
    multiply: Optional[MMPIMultiplier] = None

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