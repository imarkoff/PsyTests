from app.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.tests.pcl5.schemas.pcl5_answer import PCL5Answer
from app.tests.pcl5.schemas.pcl5_criteria import PCL5Criteria
from app.tests.pcl5.schemas.pcl5_question import PCL5Question


class PCL5TestParser:
    def parse(self, json_data: dict) -> PCL5Test:
        return PCL5Test(
            id=json_data.get('id'),
            name=json_data.get("name"),
            type=json_data.get("type"),
            description=json_data.get("description", None),
            criterion=self._parse_criterion(json_data.get('criterion')),
            answers=self._parse_answers(json_data.get('answers')),
            questions=self._parse_questions(json_data.get('questions')),
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