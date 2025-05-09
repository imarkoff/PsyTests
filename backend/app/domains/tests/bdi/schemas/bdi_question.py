from pydantic import BaseModel, ConfigDict

from app.domains.tests.bdi.schemas.bdi_answer import BDIAnswer


class BDIQuestion(BaseModel):
    """
    Represents a question in the Beck Depression Inventory (BDI).
    """

    id: str
    answers: list[BDIAnswer]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "id": "1",
                "answers": [
                    BDIAnswer.model_config["json_schema_extra"]["example"],
                ]
            }
        }
    )
