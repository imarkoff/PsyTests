from app.domains.tests.bdi.schemas.bdi_test import BDITest
from app.domains.tests.bdi.utils.score_counter import ScoreCounter
from app.domains.tests.bdi.utils.verdict_getter import VerdictGetter
from app.domains.tests.bdi.utils.verdict_interpreter import VerdictInterpreter
from app.domains.tests.bdi.verdicts import get_mark_verdicts
from app.utils.range_validator import RangeValidator


class VerdictGetterBuilder:
    def __init__(self, test: BDITest):
        self.test = test

        self.score_counter = None
        self.verdict_interpreter = None

    def with_score_counter(self, score_counter: ScoreCounter):
        self.score_counter = score_counter
        return self

    def with_verdict_interpreter(self, verdict_interpreter: VerdictInterpreter):
        self.verdict_interpreter = verdict_interpreter
        return self

    def build(self):
        self._resolve_score_counter()
        self._resolve_verdict_interpreter()

        return VerdictGetter(
            score_counter=self.score_counter,
            verdict_interpreter=self.verdict_interpreter
        )

    def _resolve_score_counter(self):
        if self.score_counter is None:
            self.score_counter = ScoreCounter(test=self.test)

    def _resolve_verdict_interpreter(self):
        if self.verdict_interpreter is None:
            self.verdict_interpreter = VerdictInterpreter(
                interpretations=get_mark_verdicts(),
                range_validator=RangeValidator()
            )
