from copy import deepcopy
from typing import Type

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_auth import UserDto
from app.services.tests.test_service import TestService
from app.tests.mmpi import verdicts
from app.tests.mmpi.mmpi_test import MMPITest
from app.tests.mmpi.utils.results_manager.abstract_results_converter import ConvertedResults
from app.tests.mmpi.utils.results_manager.results_counter import RawResults
from app.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory
from app.tests.mmpi.utils.scales_counter import ScalesCounter
from app.tests.mmpi.utils.verdict_calculator import VerdictCalculator


class MMPITestService(TestService):
    def __init__(self,
                 test: MMPITest,
                 verdict_calculator: VerdictCalculator,
                 results_manager_factory: ResultsManagerFactory,
                 scales_counter: Type[ScalesCounter],
                 ):
        super().__init__(test)
        self._verdict_calculator = verdict_calculator
        self._results_manager_factory = results_manager_factory
        self._scales_counter = scales_counter

    def hide_correct_answers(self) -> MMPITest:
        hidden_test = deepcopy(self.test)

        for question in hidden_test.questions:
            question.answers = []

        return hidden_test

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        (raw_results, converted_results) = self._get_test_results(answers, patient)
        return TestHistory(
            test_id=self.test.id,
            patient_id=patient.id,
            results=answers,
            verdict=await self._calculate_verdicts(raw_results, converted_results)
        )

    def _get_test_results(self, answers: PassTestAnswers, patient: UserDto) -> tuple[RawResults, ConvertedResults]:
        scales_count = self.count_scales_by_questions()
        results_manager = self._results_manager_factory.create(
            test=self.test, scales_count=scales_count,
            answers=answers, gender=patient.gender
        )
        return results_manager.count_and_convert()

    async def revalidate_test(self, test_history: TestHistory):
        user_dto = UserDto.create(test_history.patient)
        (raw_results, converted_results) = self._get_test_results(test_history.results, user_dto)
        test_history.verdict = await self._calculate_verdicts(raw_results, converted_results)

    async def get_marks_system(self):
        return {
            "profile_types": verdicts.get_profile_types(),
            "profile_inclinations": verdicts.get_profile_inclinations(),
            "scale_verdicts": verdicts.get_scale_verdicts()
        }

    @staticmethod
    def get_document_generator():
        from app.tests.mmpi.services.mmpi_to_docx import MMPIToDocx
        return MMPIToDocx

    def count_scales_by_questions(self):
        scales_counter = self._scales_counter(scales=self.test.scales)
        return scales_counter.count_from_questions(self.test.questions)

    async def _calculate_verdicts(self, raw_results: RawResults, converted_results: ConvertedResults) -> dict:
        return await self._verdict_calculator.calculate(
            raw_results=raw_results,
            converted_results=converted_results
        )
