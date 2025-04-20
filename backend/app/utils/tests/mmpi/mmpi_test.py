from typing import ClassVar, Optional, Type

from pydantic import ConfigDict, UUID4

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.test_base import TestBase
from app.schemas.user_auth import UserDto
from app.utils.tests.mmpi import verdicts
from app.utils.tests.mmpi.mmpi_question import MMPIQuestion
from app.utils.tests.mmpi.mmpi_scale import MMPIScale
from app.utils.tests.mmpi.utils.results_converter import ConvertedResults
from app.utils.tests.mmpi.utils.results_counter import RawResults
from app.utils.tests.mmpi.utils.results_manager import ResultsManagerFactory
from app.utils.tests.mmpi.utils.scales_counter import ScalesCounter
from app.utils.tests.mmpi.utils.verdict_calculator import VerdictCalculator


class MMPITest(TestBase):
    """MMPI Test class to represent the MMPI test structure and behavior."""
    id: UUID4
    name: str
    type: str = "mmpi"
    scales: list[MMPIScale]
    description: str | None = None
    questions: list[MMPIQuestion]

    _verdict_calculator: ClassVar[VerdictCalculator] = VerdictCalculator()
    _results_manager_factory: ClassVar[ResultsManagerFactory] = ResultsManagerFactory()
    _scales_counter: ClassVar[Type[ScalesCounter]] = ScalesCounter

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
    def configure(cls,
                  verdict_calculator: Optional[VerdictCalculator] = None,
                  results_manager_factory: Optional[ResultsManagerFactory] = None,
                  scales_counter: Optional[Type[ScalesCounter]] = None):
        """Configure the MMPI test class with custom dependencies."""
        if verdict_calculator:
            cls._verdict_calculator = verdict_calculator
        if results_manager_factory:
            cls._results_manager_factory = results_manager_factory
        if scales_counter:
            cls._scales_counter = scales_counter

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
        (raw_results, converted_results) = self._get_test_results(answers)
        return TestHistory(
            test_id=self.id,
            patient_id=patient.id,
            results=answers,
            verdict=await self._calculate_verdicts(raw_results, converted_results)
        )

    def _get_test_results(self, answers: PassTestAnswers) -> tuple[RawResults, ConvertedResults]:
        results_manager = self._results_manager_factory.create(test=self, answers=answers)
        return results_manager.count_and_convert()

    async def revalidate_test(self, test_history: TestHistory):
        (raw_results, converted_results) = self._get_test_results(test_history.results)
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

    def count_scales_by_questions(self):
        scales_counter = self._scales_counter(scales=self.scales)
        return scales_counter.count_from_questions(self.questions)

    async def _calculate_verdicts(self, raw_results: RawResults, converted_results: ConvertedResults) -> dict:
        return await self._verdict_calculator.calculate(
            raw_results=raw_results,
            converted_results=converted_results
        )