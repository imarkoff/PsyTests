from app.domains.tests.base.test_parser import TestParser
from app.domains.tests.bdi.schemas.bdi_question import BDIQuestion
from app.domains.tests.bdi.schemas.bdi_test import BDITest


class BDITestParser(TestParser):
    @classmethod
    def parse(cls, data: dict) -> BDITest:
        return BDITest(
            id=data.get("id"),
            name=data.get("name"),
            description=data.get("description"),
            type=data.get("type"),
            questions=cls._parse_questions(data.get("questions")),
        )

    @staticmethod
    def _parse_questions(questions: dict) -> list[BDIQuestion]:
        return [
            BDIQuestion(
                id=q.get("id"),
                answers=q.get("answers")
            )
            for q in questions
        ]
