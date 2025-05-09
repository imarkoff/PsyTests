from app.domains.tests.bdi.schemas.bdi_verdict import BDIVerdict
from app.domains.tests.bdi.utils.score_counter import ScoreCounter
from app.domains.tests.bdi.utils.verdict_interpreter import VerdictInterpreter
from app.schemas.pass_test import PassTestAnswers


class VerdictGetter:
    """Class to get the verdict of a BDI test"""

    def __init__(self, score_counter: ScoreCounter, verdict_interpreter: VerdictInterpreter):
        self.counter = score_counter
        self.interpreter = verdict_interpreter

    def get_verdict(self, answers: PassTestAnswers) -> BDIVerdict:
        """Get the verdict based on the answers provided."""
        total_score = self.counter.count(answers)
        verdict = self.interpreter.interpret(total_score)
        return BDIVerdict(
            total_score=total_score,
            verdict=verdict
        )
