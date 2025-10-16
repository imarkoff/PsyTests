from app.domains.tests.base.test_parser import TestParser
from app.domains.tests.stai.schemas.stai_answer import STAIAnswer
from app.domains.tests.stai.schemas.stai_question import STAIQuestion
from app.domains.tests.stai.schemas.stai_scale import STAIScale
from app.domains.tests.stai.schemas.stai_test import STAITest


class STAIParser(TestParser):
    @classmethod
    def parse(cls, data: dict) -> STAITest:
        return STAITest(
            id=data.get("id"),
            name=data.get("name"),
            type=data.get("type"),
            description=data.get("description"),
            scales=cls._parse_scales(data.get("scales")),
            answers=cls._parse_answers(data.get("answers")),
            questions=cls._parse_questions(data.get("questions"))
        )

    @staticmethod
    def _parse_scales(scales: list[dict]) -> list[STAITest]:
        return [STAIScale(**scale) for scale in scales]

    @staticmethod
    def _parse_answers(answers: list[dict]) -> list[STAIAnswer]:
        return [STAIAnswer(**answer) for answer in answers]

    @staticmethod
    def _parse_questions(questions: list[dict]) -> list[STAIQuestion]:
        return [STAIQuestion(**question) for question in questions]
