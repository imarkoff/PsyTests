from pydantic import BaseModel, ConfigDict


class MMPIBigScale(BaseModel):
    label: str
    abbrev: str | None = None
    name: str

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