from abc import ABC, abstractmethod
from typing import Type

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.domains.tests.base.test_base import TestBase
from app.schemas.user_auth import UserDto
from app.utils.results_to_docx.results_to_docx import ResultsToDocx


class TestProcessor(ABC):
    """Service for managing test"""
    def __init__(self, test: TestBase) -> None:
        self.test = test

    @abstractmethod
    def hide_correct_answers(self) -> TestBase:
        """
        Hide correct answers or specific data
        what should not be shown to the patient
        """
        pass

    @abstractmethod
    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        """
        Function to convert answers to test history
        """
        return TestHistory(
            test_id=self.test.id,
            patient_id=patient.id,
            results=answers,  # can be converted for test needs or left as is
            verdict=None  # is just a dict where you can put any data based on the test needs
        )

    @abstractmethod
    async def revalidate_test(self, test_history: TestHistory):
        """
        Revalidate test results.
        Can be used to recalculate results after changes in the test.
        """
        test_history.results = test_history.results

    @abstractmethod
    async def get_marks_system(self) -> None:
        """
        Get marks system. Normally returns json data.
        You may need this or not, depending on the test type.
        """
        return None

    @staticmethod
    @abstractmethod
    def get_document_generator() -> Type[ResultsToDocx]:
        """
        Get document generator class
        """
        return ResultsToDocx