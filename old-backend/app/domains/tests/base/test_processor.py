from abc import ABC, abstractmethod
from typing import Type

from app.domains.tests.base.test_verdict import TestVerdict
from app.schemas.pass_test import PassTestAnswers
from app.domains.tests.base.test_base import TestBase
from app.schemas.user import UserDto
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
    async def get_verdict(self, answers: PassTestAnswers, patient: UserDto) -> TestVerdict | None:
        """
        Get test verdict based on test results
        :param answers: answers to the test filled by patient
        :param patient: information about a patient what may be needed for verdict
        :returns: a verdict for the passed test or None if verdict is not needed
        """
        pass

    @abstractmethod
    async def get_marks_system(self) -> None:
        """
        Get marks system. Normally returns json data.
        You may need this or not, depending on the test type.
        """
        pass

    @staticmethod
    @abstractmethod
    def get_document_generator() -> Type[ResultsToDocx]:
        """
        Get document generator class
        """
        pass
