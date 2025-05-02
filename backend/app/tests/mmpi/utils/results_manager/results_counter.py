from typing import TYPE_CHECKING, TypeAlias

from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_gender import UserGender
from app.tests.mmpi.schemas.mmpi_question import MMPIAnswer

if TYPE_CHECKING:
    from app.tests.mmpi.mmpi_test import MMPITest
else:
    MMPITest = "MMPITest"


RawResults: TypeAlias = dict[str, int]


class ResultsCounter:
    """
    Count raw mark results for each scale
    """
    def __init__(self, test: MMPITest, answers: PassTestAnswers, gender: UserGender):
        """
        :param test: MMPI test
        :param answers: Answers to the test
        """
        self.test = test
        self.answers = answers
        self.gender = gender

        self._results = {}

    @property
    def results(self) -> RawResults:
        """Get raw results. Should be called after count()"""
        return self._results

    def count(self) -> RawResults:
        """
        Count raw results for each scale
        :return: Raw results
        """
        self._results = self._initialize_results()
        self._count_correct_answers_by_test_questions()
        return self._results

    def _initialize_results(self) -> dict[str, int]:
        return {scale.label: 0 for scale in self.test.scales}

    def _count_correct_answers_by_test_questions(self):
        for i, question in enumerate(self.test.questions):
            original_answer = self.answers["_"][i]
            patient_answer = self._patient_answer_to_bool(original_answer)

            self._count_scale_answers_by_question_answers(question.answers, patient_answer)

    @staticmethod
    def _patient_answer_to_bool(answer: int | None) -> bool | None:
        patient_answer = None
        if answer == 0:
            patient_answer = True
        elif answer == 1:
            patient_answer = False
        return patient_answer

    def _count_scale_answers_by_question_answers(self, answers: list[MMPIAnswer], patient_answer: bool | None):
        """Count correct answers for each scale by question answers"""
        for answer in answers:
            for label in answer.scales:
                if self._check_if_answer_is_correct(answer, patient_answer):
                    self._results[label] += 1

    def _check_if_answer_is_correct(self, answer: MMPIAnswer, patient_answer: bool | None) -> bool:
        """
        :param answer: Answer to the question
        :param patient_answer: Patient answer
        """
        if answer.answer == patient_answer:
            if answer.gender is None or self.gender in answer.gender:
                return True
        return False