from app.domains.tests.stai.schemas.stai_question import ScoringType
from app.domains.tests.stai.schemas.stai_test import STAITest
from app.schemas.pass_test import PassTestAnswers


STAICounterType = dict[str, dict[ScoringType, int]]


class ScoreCounter:
    def __init__(self, test: STAITest):
        self.test = test

    def count(self, answers: PassTestAnswers) -> STAICounterType:
        """Count the scores based on the provided answers"""
        counter = self._initialize_counter_for_scales()
        default_answers = answers.get("_", [])

        for question_index, answer_index in enumerate(default_answers):
            gotten_mark = self._get_mark(question_index, answer_index)
            if gotten_mark is not None:
                (scale, scoring_type, mark) = gotten_mark
                counter[scale][scoring_type] += mark

        return counter

    def _get_mark(self, question_index: int, answer_index: int) -> tuple[str, ScoringType, int] | None:
        try:
            question = self.test.questions[question_index]
            answer = self.test.answers[answer_index]

            if question.scoring_type is not None:
                return question.scale, question.scoring_type, answer.mark

        except IndexError:
            return None

    def _initialize_counter_for_scales(self) -> STAICounterType:
        counter: STAICounterType = {}

        for scale in self.test.scales:
            counter[scale.label] = {"negative": 0, "positive": 0}

        return counter
