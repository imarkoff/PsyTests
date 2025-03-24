from pydantic import ConfigDict, UUID4

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.test_base import TestBase
from app.schemas.user_auth import UserDto
from app.utils.tests.mmpi import verdicts
from app.utils.tests.mmpi.mmpi_question import MMPIQuestion
from app.utils.tests.mmpi.mmpi_scale import MMPIScale
from app.utils.tests.mmpi.utils import calculate_util
from app.utils.tests.mmpi.utils.get_profile_inclinations import get_profile_inclinations
from app.utils.tests.mmpi.utils.get_profile_types import get_profile_types
from app.utils.tests.mmpi.utils.get_verdicts import get_verdicts


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
        raw_results = calculate_util.calculate_results(self, answers)
        converted_results = calculate_util.convert_results(self, raw_results)

        return TestHistory(
            test_id=self.id,
            patient_id=patient.id,
            results=answers,
            verdict=await self._calculate_verdicts(raw_results, converted_results)
        )

    async def revalidate_test(self, test_history: TestHistory):
        raw_results = calculate_util.calculate_results(self, test_history.results)
        converted_results = calculate_util.convert_results(self, raw_results)

        test_history.results = test_history.results
        test_history.verdict = await self._calculate_verdicts(raw_results, converted_results)

    async def get_marks_system(self):
        return {
            "profile_types": verdicts.get_profile_types(),
            "profile_inclinations": verdicts.get_profile_inclinations(),
            "scale_verdicts": verdicts.get_scale_verdicts()
        }

    @staticmethod
    def get_document_generator():
        from app.utils.tests.mmpi.mmpi_to_docx import MMPIToDocx
        return MMPIToDocx

    # TODO: cache the result
    def count_scale_questions(self):
        scales = {scale.label: 0 for scale in self.scales}

        for question in self.questions:
            for answer in question.answers:
                for label in answer.scales:
                    scales[label] += 1

        return scales

    @staticmethod
    async def _calculate_verdicts(results: dict, converted_results: dict) -> dict:
        return {
            "raw": results,
            "converted": converted_results,
            "scale_verdicts": await get_verdicts(converted_results),
            "profile_types": await get_profile_types(converted_results),
            "profile_inclinations": await get_profile_inclinations(converted_results)
        }