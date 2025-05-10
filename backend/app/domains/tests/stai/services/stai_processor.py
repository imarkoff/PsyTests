from copy import deepcopy
from typing import Type

from app.db.models.test_history import TestHistory
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.stai.schemas.stai_test import STAITest
from app.domains.tests.stai.utils.verdict_getter import STAIVerdictGetter
from app.domains.tests.stai.verdicts import get_stai_verdicts
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_auth import UserDto
from app.utils.results_to_docx.results_to_docx import ResultsToDocx


class STAITestProcessor(TestProcessor):
    def __init__(self, test: STAITest, verdict_getter: STAIVerdictGetter):
        super().__init__(test)
        self.verdict_getter = verdict_getter

    def hide_correct_answers(self) -> STAITest:
        test_with_hidden_answers: STAITest = deepcopy(self.test)

        for answer in test_with_hidden_answers.answers:
            answer.mark = None

        for question in test_with_hidden_answers.questions:
            question.scale = None
            question.scoring_type = None

        return test_with_hidden_answers

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        return TestHistory(
            test_id=self.test.id,
            patient_id=patient.id,
            results=answers,
            verdict=await self._get_verdict(answers),
        )

    async def _get_verdict(self, answers: PassTestAnswers) -> dict:
        verdict = self.verdict_getter.get_verdict(answers)
        return verdict.model_dump()

    async def revalidate_test(self, test_history: TestHistory):
        test_history.verdict = await self._get_verdict(test_history.results)

    async def get_marks_system(self):
        return {
            "verdicts": get_stai_verdicts()
        }

    @staticmethod
    def get_document_generator() -> Type[ResultsToDocx]:
        return ResultsToDocx
