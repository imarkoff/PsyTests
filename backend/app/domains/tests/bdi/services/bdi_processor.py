from copy import deepcopy
from typing import Type

from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.bdi.schemas.bdi_test import BDITest
from app.domains.tests.bdi.schemas.bdi_verdict import BDIVerdict
from app.domains.tests.bdi.utils.verdict_getter import VerdictGetter
from app.domains.tests.pcl5.verdicts import get_count_verdicts
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_auth import UserDto
from app.utils.results_to_docx.results_to_docx import ResultsToDocx


class BDITestProcessor(TestProcessor):
    def __init__(self, test: BDITest, verdict_getter: VerdictGetter) -> None:
        self.verdict_getter = verdict_getter
        super().__init__(test)

    def hide_correct_answers(self) -> BDITest:
        test_with_hidden_answers: BDITest = deepcopy(self.test)

        for question in test_with_hidden_answers.questions:
            for answer in question.answers:
                answer.mark = None

        return test_with_hidden_answers

    async def get_verdict(self, answers: PassTestAnswers, patient: UserDto) -> BDIVerdict:
        return self.verdict_getter.get_verdict(answers)

    async def get_marks_system(self):
        return {
            "count_verdicts": get_count_verdicts()
        }

    @staticmethod
    def get_document_generator() -> Type[ResultsToDocx]:
        return ResultsToDocx
