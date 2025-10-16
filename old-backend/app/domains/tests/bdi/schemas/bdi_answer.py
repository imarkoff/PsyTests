from pydantic import BaseModel, ConfigDict


class BDIAnswer(BaseModel):
    """
    Represents a possible answer in the Beck Depression Inventory (BDI).
    """

    name: str
    mark: int | None  # None if mark is hidden

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "name": "Я весь час засмучений і не можу від цього відволіктися",
                "mark": 2
            }
        }
    )
