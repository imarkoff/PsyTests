from app.domains.tests.stai.schemas.stai_test import STAITest
from app.domains.tests.stai.utils.score_converter import ScoreConverter
from app.domains.tests.stai.utils.score_counter import ScoreCounter
from app.domains.tests.stai.utils.verdict_getter import STAIVerdictGetter
from app.domains.tests.stai.utils.verdict_interpreter import VerdictInterpreter
from app.domains.tests.stai.verdicts import get_stai_verdicts
from app.utils.range_validator import RangeValidator


class VerdictGetterBuilder:
    """
    Builder for creating a STAIVerdictGetter instance.
    """

    def __init__(self, test: STAITest):
        self.test = test

        self.score_counter = None
        self.score_converter = None
        self.verdict_interpreter = None

    def with_score_counter(self, score_counter: ScoreCounter):
        self.score_counter = score_counter
        return self

    def with_score_converter(self, score_converter: ScoreConverter):
        self.score_converter = score_converter
        return self

    def with_verdict_interpreter(self, verdict_interpreter: VerdictInterpreter):
        self.verdict_interpreter = verdict_interpreter
        return self

    def build(self) -> STAIVerdictGetter:
        self._resolve_score_counter()
        self._resolve_score_converter()
        self._resolve_verdict_interpreter()

        return STAIVerdictGetter(
            score_counter=self.score_counter,
            score_converter=self.score_converter,
            verdict_interpreter=self.verdict_interpreter,
        )

    def _resolve_score_counter(self):
        if self.score_counter is None:
            self.score_counter = ScoreCounter(test=self.test)

    def _resolve_score_converter(self):
        if self.score_converter is None:
            self.score_converter = ScoreConverter(test=self.test)

    def _resolve_verdict_interpreter(self):
        if self.verdict_interpreter is None:
            self.verdict_interpreter = VerdictInterpreter(
                verdicts=get_stai_verdicts(),
                range_validator=RangeValidator()
            )
