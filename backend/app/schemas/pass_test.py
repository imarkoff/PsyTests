from typing import Dict, List, Optional, TypeAlias
from uuid import UUID

from pydantic import BaseModel, ConfigDict

PassTestAnswers: TypeAlias = Dict[str, List[Optional[str | int]]]

class PassTestDto(BaseModel):
    assigned_test_id: UUID
    answers: PassTestAnswers

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "assigned_test_id": "123e4567-e89b-12d3-a456-426614174000",
                "answers": {
                    "_": ["Some horrible event", 2, 3, 4, None],
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
        if not self._validate_answer_groups(self.answers):
            return False
        return True

    def _validate_answer_groups(self, modules: dict) -> bool:
        for group, answers in modules.items():
            if not isinstance(answers, list) or not self._are_answers_valid(answers):
                return False
        return True

    @staticmethod
    def _are_answers_valid(answers: list[Optional[str | int]]) -> bool:
        """
        Validate individual answers in a list.
        """
        return all(answer is None or isinstance(answer, (int, str)) for answer in answers)