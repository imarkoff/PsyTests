from typing import Optional

from pydantic import Field, ConfigDict

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.test.test_history_results import Results
from app.schemas.user_auth import UserDto
from app.utils.read_csv_as_matrix import read_csv_as_matrix
from app.utils.tests.raven import test_includes
from app.utils.tests.raven.calculate_points import calculate_points
from app.utils.tests.raven.convert_results import convert_results
from app.utils.tests.raven.get_result_mark import get_result_mark
from app.utils.tests.raven.question import Question
from app.schemas.test.test_module import TestModule
from app.schemas.test_base import TestBase
from app.utils.tests.raven.test_includes import get_test_module


class RavenTest(TestBase):
    modules: Optional[list[TestModule]] = Field(None, title="Modules")
    questions: Optional[list[Question]] = Field(..., title="Questions")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                **TestBase.model_config.get("example", {}),
                "modules": [
                    TestModule.model_config.get("example", {})
                ],
                "description": "Test description",
                "questions": [  # must contain image or question text
                    Question.model_config.get("example", {})
                ],
            }
        }
    )

    @classmethod
    def from_json(cls, test_data: dict) -> 'RavenTest':
        test_id = test_data.get("id")

        return cls(
            id=test_id,
            name=test_data.get("name"),
            type=test_data.get("type"),
            modules=[get_test_module(test_id, module) for module in test_data.get('modules', [])],
            description=test_data.get("description", None),
            questions=[Question.from_json(question_data) for question_data in test_data.get("questions", [])],
            marks_path=test_data.get("marks", None),
            marks_unit=test_data.get("marks_unit", None)
        )

    def get_module(self, module_name: str) -> TestModule | None:
        """
        Get module by name
        """

        for module in self.modules:
            if module.name == module_name:
                return module
        return None

    def hide_correct_answers(self):
        """
        Hide correct answers
        """

        if self.questions:
            for question in self.questions:
                for answer in question.answers:
                    answer.is_correct = False

        for module in self.modules:
            for question in module.questions:
                for answer in question.answers:
                    answer.is_correct = False

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        collected_points = await calculate_points(self, answers)

        return TestHistory(
            test_id=self.id,
            patient_id=patient.id,
            results=convert_results(self, answers).model_dump(),
            verdict={
                "_": await get_result_mark(self, collected_points[1], patient)
            }
        )

    async def revalidate_test(self, test_history: TestHistory):
        results: Results = Results.model_validate(test_history.results)
        collected_points = self._count_collected_points(results)

        test_history.verdict = {
            "_": await get_result_mark(self, collected_points, UserDto.create(test_history.patient))
        }

    async def get_marks_system(self) -> list[list[int | str | float | None]]:
        marks_path = test_includes.get_marks_path(self)
        return read_csv_as_matrix(marks_path)

    @staticmethod
    def get_document_generator():
        from app.utils.tests.raven.raven_to_docx import RavenToDocx
        return RavenToDocx

    @staticmethod
    def _count_collected_points(results: Results) -> int:
        collected_points = 0

        for module, answers in results.root.items():
            for i, answer in enumerate(answers):
                if answer.user_answer == answer.correct_answer:
                    collected_points += answer.points

        return collected_points