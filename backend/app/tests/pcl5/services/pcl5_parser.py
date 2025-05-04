from app.services.tests.test_parser import TestParser
from app.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.tests.pcl5.schemas.pcl5_answer import PCL5Answer
from app.tests.pcl5.schemas.pcl5_criteria import PCL5Criteria
from app.tests.pcl5.schemas.pcl5_question import PCL5Question


class PCL5TestParser(TestParser):
    @classmethod
    def parse(cls, data: dict) -> PCL5Test:
        return PCL5Test(
            id=data.get('id'),
            name=data.get("name"),
            type=data.get("type"),
            description=data.get("description", None),
            criterion=cls._parse_criterion(data.get('criterion')),
            answers=cls._parse_answers(data.get('answers')),
            questions=cls._parse_questions(data.get('questions')),
        )

    @staticmethod
    def _parse_criterion(criterion: list[dict]) -> list[PCL5Criteria]:
        return [PCL5Criteria(**criteria) for criteria in criterion]

    @staticmethod
    def _parse_answers(answers: list[dict]) -> list[PCL5Answer]:
        return [PCL5Answer(**answer) for answer in answers]

    @staticmethod
    def _parse_questions(questions: list[dict]) -> list[PCL5Question]:
        return [PCL5Question(**question) for question in questions]