from copy import deepcopy
from typing import Type

from app.domains.tests.mmpi.schemas.mmpi_verdict import MMPIVerdict
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_auth import UserDto
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.mmpi import verdicts
from app.domains.tests.mmpi.schemas.mmpi_test import MMPITest
from app.domains.tests.mmpi.utils.results_manager.abstract_results_converter import ConvertedResults
from app.domains.tests.mmpi.utils.results_manager.results_counter import RawResults
from app.domains.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory
from app.domains.tests.mmpi.utils.scales_counter import ScalesCounter
from app.domains.tests.mmpi.utils.verdict_calculator import VerdictCalculator


class MMPITestProcessor(TestProcessor):
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

    async def get_verdict(self, answers: PassTestAnswers, patient: UserDto) -> MMPIVerdict:
        (raw_results, converted_results) = self._get_test_results(answers, patient)
        return await self._verdict_calculator.calculate(
            raw_results=raw_results,
            converted_results=converted_results
        )

    def _get_test_results(self, answers: PassTestAnswers, patient: UserDto) -> tuple[RawResults, ConvertedResults]:
        scales_count = self.count_scales_by_questions()
        results_manager = self._results_manager_factory.create(
            test=self.test, scales_count=scales_count,
            answers=answers, gender=patient.gender
        )
        return results_manager.count_and_convert()

    async def get_marks_system(self):
        return {
            "profile_types": verdicts.get_profile_types(),
            "profile_inclinations": verdicts.get_profile_inclinations(),
            "scale_verdicts": verdicts.get_scale_verdicts()
        }

    @staticmethod
    def get_document_generator():
        from app.domains.tests.mmpi.to_docx.mmpi_to_docx import MMPIToDocx
        return MMPIToDocx

    def count_scales_by_questions(self):
        scales_counter = self._scales_counter(scales=self.test.scales)
        return scales_counter.count_from_questions(self.test.questions)
