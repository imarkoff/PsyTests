from copy import deepcopy

from app.domains.tests.raven.schemas.raven_verdict import RavenVerdict
from app.schemas.pass_test import PassTestAnswers
from app.domains.tests.raven.schemas.test_history_results import RavenTestResults
from app.schemas.user import UserDto
from app.domains.tests.base.test_processor import TestProcessor
from app.utils.read_csv_as_matrix import read_csv_as_matrix
from app.domains.tests.raven.utils import test_includes
from app.domains.tests.raven.utils.convert_results import convert_results
from app.domains.tests.raven.utils.get_result_mark import get_result_mark
from app.domains.tests.raven.schemas.raven_test import RavenTest


class RavenTestProcessor(TestProcessor):
    def __init__(self, test: RavenTest):
        super().__init__(test)

    def hide_correct_answers(self) -> RavenTest:
        """
        Hide correct answers
        """
        hidden_test = deepcopy(self.test)

        if hidden_test.questions:
            for question in hidden_test.questions:
                for answer in question.answers:
                    answer.is_correct = False

        for module in hidden_test.modules:
            for question in module.questions:
                for answer in question.answers:
                    answer.is_correct = False

        return hidden_test

    async def get_verdict(self, answers: PassTestAnswers, patient: UserDto) -> RavenVerdict:
        results = convert_results(self.test, answers)
        collected_points = self._count_collected_points(results)
        return RavenVerdict(
            results=results,
            verdict=await get_result_mark(self.test, collected_points, patient)
        )

    async def get_marks_system(self) -> list[list[int | str | float | None]]:
        marks_path = test_includes.get_marks_path(self.test)
        return read_csv_as_matrix(marks_path)

    @staticmethod
    def get_document_generator():
        from app.domains.tests.raven.to_docx.raven_to_docx import RavenToDocx
        return RavenToDocx

    @staticmethod
    def _count_collected_points(results: RavenTestResults) -> int:
        collected_points = 0

        for module, answers in results.root.items():
            for i, answer in enumerate(answers):
                if answer.user_answer == answer.correct_answer:
                    collected_points += answer.points

        return collected_points
