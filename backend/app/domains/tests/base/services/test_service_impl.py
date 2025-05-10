from app.domains.tests.base.test_verdict import TestVerdict
from app.schemas.pass_test import PassTestAnswers
from app.domains.tests.base.test_base import TestBase
from app.schemas.user_auth import UserDto
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.base.services.results_to_docx_impl import ResultsToDocxImpl


class TestProcessorImpl(TestProcessor):
    def __init__(self, test: TestBase) -> None:
        super().__init__(test)

    def hide_correct_answers(self) -> TestBase:
        return self.test

    async def get_verdict(self, answers: PassTestAnswers, patient: UserDto) -> TestVerdict | None:
        return None

    async def get_marks_system(self) -> None:
        return None

    @staticmethod
    def get_document_generator():
        return ResultsToDocxImpl
