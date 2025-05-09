from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.mmpi.services.mmpi_test_parser import MMPITestParser
from app.domains.tests.mmpi.services.mmpi_test_service import MMPITestProcessor
from app.domains.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory
from app.domains.tests.mmpi.utils.scales_counter import ScalesCounter
from app.domains.tests.mmpi.utils.verdict_calculator import VerdictCalculator


class MMPITestFactory(TestFactory):
    def __init__(self, parser=MMPITestParser()):
        super().__init__(parser)

    def get_service(self, test: TestBase) -> TestProcessor:
        return MMPITestProcessor(
            test=test,
            results_manager_factory=ResultsManagerFactory(),
            verdict_calculator=VerdictCalculator(),
            scales_counter=ScalesCounter
        )
