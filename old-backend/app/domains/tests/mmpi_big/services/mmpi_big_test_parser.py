from app.domains.tests.base.test_parser import TestParser
from app.domains.tests.mmpi.schemas.mmpi_question import MMPIQuestion
from app.domains.tests.mmpi_big.schemas.mmpi_big import MMPIBigTest
from app.domains.tests.mmpi_big.schemas.mmpi_big_scale import MMPIBigScale


class MMPIBigTestParser(TestParser):
    @classmethod
    def parse(cls, test_data: dict) -> MMPIBigTest:
        return MMPIBigTest(
            id=test_data.get("id"),
            name=test_data.get("name"),
            scales=cls._parse_scales(test_data.get('scales', [])),
            description=test_data.get("description", None),
            questions=cls._parse_questions(test_data.get('questions', []))
        )

    @staticmethod
    def _parse_scales(scales: list[dict]):
        return [MMPIBigScale(**scale) for scale in scales]

    @staticmethod
    def _parse_questions(questions: list[dict]):
        return [MMPIQuestion(**question) for question in questions]