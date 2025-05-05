from app.domains.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.domains.tests.pcl5.utils.verdict_getter.count_interpreter import CountInterpreter
from app.domains.tests.pcl5.utils.verdict_getter.criterion_counter import CriterionCounter
from app.domains.tests.pcl5.utils.verdict_getter.verdict_getter import VerdictGetter
from app.domains.tests.pcl5.verdicts import get_count_verdicts


class VerdictGetterBuilder:
    """Resolves dependencies for verdict"""
    def __init__(self, test: PCL5Test):
        self.test = test

        self.counter: CriterionCounter | None = None
        self.interpreter: CountInterpreter | None = None

    def with_counter(self, counter: CriterionCounter):
        self.counter = counter
        return self

    def with_interpreter(self, interpreter: CountInterpreter):
        self.interpreter = interpreter
        return self

    def build(self) -> VerdictGetter:
        self._resolve_counter()
        self._resolve_interpreter()

        return VerdictGetter(self.counter, self.interpreter)

    def _resolve_counter(self):
        if self.counter is None:
            self.counter = CriterionCounter(test=self.test)

    def _resolve_interpreter(self):
        if self.interpreter is None:
            self.interpreter = CountInterpreter(
                count_interpretations=get_count_verdicts()
            )
