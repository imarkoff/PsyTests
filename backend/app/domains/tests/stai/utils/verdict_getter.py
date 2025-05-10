from app.domains.tests.stai.schemas.stai_verdict import STAIVerdict, STAIScaleScore
from app.domains.tests.stai.utils.score_converter import ScoreConverter, STAIConvertedResults
from app.domains.tests.stai.utils.score_counter import ScoreCounter, STAICounterType
from app.domains.tests.stai.utils.verdict_interpreter import VerdictInterpreter
from app.schemas.pass_test import PassTestAnswers


class STAIVerdictGetter:
    def __init__(self,
                 score_counter: ScoreCounter,
                 score_converter: ScoreConverter,
                 verdict_interpreter: VerdictInterpreter):
        self.counter = score_counter
        self.converter = score_converter
        self.interpreter = verdict_interpreter

    def get_verdict(self, answers: PassTestAnswers) -> STAIVerdict:
        score = self.counter.count(answers)
        converted_score = self.converter.convert(score)

        score_entities = self._get_score_entities(score, converted_score)
        verdicts = self.interpreter.interpret(converted_score)

        return STAIVerdict(
            score=score_entities,
            verdicts=verdicts,
        )

    @staticmethod
    def _get_score_entities(score: STAICounterType, converted: STAIConvertedResults) -> list[STAIScaleScore]:
        score_entities = []

        for scale_label, raw_score in score.items():
            score_entities.append(STAIScaleScore(
                scale_label=scale_label,
                negative=raw_score["negative"],
                positive=raw_score["positive"],
                converted_score=converted[scale_label],
            ))

        return score_entities
