from app.domains.tests.bdi.schemas.bdi_test import BDITest
from app.schemas.pass_test import PassTestAnswers


class ScoreCounter:
    """
    Class to count the score of a BDI test
    based on the answers provided.
    """

    def __init__(self, test: BDITest):
        self.test = test

    def count(self, answers: PassTestAnswers):
        """Count the score based on the answers provided."""
        score = 0
        for question_index, answer_index in enumerate(answers["_"]):
            try:
                score += self._get_mark(question_index, answer_index)
            except IndexError:
                continue

        return score

    def _get_mark(self, question_index: int, answer_index: int) -> int:
        question = self.test.questions[question_index]
        answer = question.answers[answer_index]

        if answer.mark is not None:
            return answer.mark
        else:
            return 0
