from typing import Dict, List, Optional
from uuid import UUID

from pydantic import BaseModel, ConfigDict

type PassTestAnswers = Dict[str, List[Optional[int]]]

class PassTestDto(BaseModel):
    assigned_test_id: UUID
    answers: PassTestAnswers

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "assigned_test_id": "123e4567-e89b-12d3-a456-426614174000",
                "answers": {
                    "_": [1, 2, 3, 4, None],
                    "A": [1, None, None, 4, 5]
                },
                "_": "Question number is the index in the list and the value is the answer number"
            }
        }
    )