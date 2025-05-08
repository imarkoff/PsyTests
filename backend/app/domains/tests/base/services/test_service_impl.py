from app.db.models.test_history import TestHistory
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

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        return await super().pass_test(answers, patient)

    async def revalidate_test(self, test_history: TestHistory):
        return await super().revalidate_test(test_history)

    async def get_marks_system(self) -> None:
        return await super().get_marks_system()

    @staticmethod
    def get_document_generator():
        return ResultsToDocxImpl