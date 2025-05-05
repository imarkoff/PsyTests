from app.schemas.pass_test import PassTestAnswers
from app.domains.tests.pcl5.utils.verdict_getter.count_interpreter import CountInterpreter
from app.domains.tests.pcl5.utils.verdict_getter.criterion_counter import CriterionCounter
from app.domains.tests.pcl5.utils.verdict_getter.pcl5_verdict import PCL5Verdict


class VerdictGetter:
    """Orchestrates the verdict counter and getter"""

    def __init__(self, counter: CriterionCounter, interpreter: CountInterpreter):
        self.counter = counter
        self.interpreter = interpreter

    def get_verdict(self, answers: PassTestAnswers) -> PCL5Verdict:
        """Get test verdict based on patient answers"""
        counts = self.counter.count(answers)
        verdict = self.interpreter.get(counts)

        return PCL5Verdict(
            counts=counts,
            verdict=verdict,
        )