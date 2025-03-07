from pydantic import ConfigDict, UUID4

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.test_base import TestBase
from app.schemas.user_auth import UserDto
from app.utils.tests.mmpi.mmpi_question import MMPIQuestion
from app.utils.tests.mmpi.mmpi_scale import MMPIScale


class MMPITest(TestBase):
    id: UUID4
    name: str
    type: str = "mmpi"
    scales: list[MMPIScale]
    description: str | None = None
    questions: list[MMPIQuestion]

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                **TestBase.model_json_schema()["example"],
                "type": "mmpi",
                "scales": [
                    MMPIScale.model_json_schema()["example"]
                ],
            }
        }
    )

    @classmethod
    def from_json(cls, test_data: dict) -> 'MMPITest':
        return cls(
            id=test_data.get("id"),
            name=test_data.get("name"),
            scales=[MMPIScale(**scale_data) for scale_data in test_data.get('scales', [])],
            description=test_data.get("description", None),
            questions=[MMPIQuestion(**question_data) for question_data in test_data.get("questions", [])]
        )

    def hide_correct_answers(self):
        for question in self.questions:
            question.answers = []

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        return TestHistory(
            test_id=self.id,
            patient_id=patient.id,
            results=answers,
            verdict={
                "raw": self.calculate_results(answers),
                "converted": self.convert_results(self.calculate_results(answers))
            }
        )

    def calculate_results(self, answers: dict[str, list[int | None]]) -> dict[str, int]:
        """
        Calculate results for each scale
        """

        results = {scale.label: 0 for scale in self.scales}

        for i, question in enumerate(self.questions):
            patient_answer = None
            if answers["_"][i] == 0:
                patient_answer = True
            elif answers["_"][i] == 1:
                patient_answer = False

            for answer in question.answers:
                for label in answer.scales:
                    results[label] += 1 if answer.answer == patient_answer else 0

        return results

    def convert_results(self, results: dict[str, int]) -> dict[str, float]:
        """
        Convert calculated results to scale values
        """

        converted: dict[str, float] = {}
        scales_count = self.count_scale_questions()

        for scale in self.scales:
            result = results[scale.label]
            multiplier = 0

            if scale.multiply:
                multiplier = results[scale.multiply.scale] * scale.multiply.multiplier

            result_percent = (result + multiplier) / (scales_count[scale.label] + multiplier)
            converted[scale.label] = scale.min + (scale.max - scale.min) * result_percent

        return converted

    # TODO: cache the result
    def count_scale_questions(self):
        scales = {scale.label: 0 for scale in self.scales}

        for question in self.questions:
            for answer in question.answers:
                for label in answer.scales:
                    scales[label] += 1

        return scales