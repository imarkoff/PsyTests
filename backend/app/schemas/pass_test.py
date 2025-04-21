from typing import Dict, List, Optional, TypeAlias
from uuid import UUID

from pydantic import BaseModel, ConfigDict

PassTestAnswers: TypeAlias = Dict[str, List[Optional[int]]]

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

    def is_valid(self) -> bool:
        if not isinstance(self.answers, dict):
            return False
        if len(self.answers) == 0:
            return False
        if not self._check_per_modules(self.answers):
            return False
        return True

    def _check_per_modules(self, modules: dict) -> bool:
        for module, answers in modules.items():
            if not isinstance(answers, list):
                return False
            if not self._is_answers_valid(answers):
                return False
        return True

    @staticmethod
    def _is_answers_valid(answers: list[int]) -> bool:
        for answer in answers:
            if answer is not None and not isinstance(answer, int):
                return False
        return True