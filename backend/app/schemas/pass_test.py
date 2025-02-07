from uuid import UUID

from pydantic import BaseModel, ConfigDict


class PassTestDto(BaseModel):
    assigned_test_id: UUID
    answers: list[int | None]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "assigned_test_id": "123e4567-e89b-12d3-a456-426614174000",
                "answers": [0, 3, 1, 5, 2],
                "_": "Question number is the index in the list and the value is the answer number"
            }
        }
    )