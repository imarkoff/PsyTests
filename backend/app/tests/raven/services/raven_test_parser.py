from uuid import UUID

from app.services.tests.test_parser import TestParser
from app.tests.raven.question import Question
from app.tests.raven.raven_test import RavenTest
from app.tests.raven.test_includes import get_test_module


class RavenTestParser(TestParser):
    @classmethod
    def parse(cls, data: dict) -> RavenTest:
        test_id = data.get("id")

        return RavenTest(
            id=test_id,
            name=data.get("name"),
            type=data.get("type"),
            modules=cls._parse_modules(test_id, data.get('modules', [])),
            description=data.get("description", None),
            questions=cls._parse_questions(data.get("questions", [])),
            marks_path=data.get("marks", None),
            marks_unit=data.get("marks_unit", None)
        )

    @staticmethod
    def _parse_modules(test_id: UUID, modules: list[str]):
        return [get_test_module(test_id, module) for module in modules]

    @staticmethod
    def _parse_questions(questions: list[dict]):
        return [Question(**question) for question in questions]