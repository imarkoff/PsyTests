from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.mmpi.services.mmpi_test_service import MMPITestProcessor
from app.domains.tests.mmpi.utils.scales_counter import ScalesCounter
from app.domains.tests.mmpi.utils.verdict_calculator import VerdictCalculator
from app.domains.tests.mmpi_big.services.mmpi_big_test_parser import MMPIBigTestParser
from app.domains.tests.mmpi_big.utils.mmpi_big_results_manager_factory import MMPIBigResultsManagerFactory


class MMPIBigTestFactory(TestFactory):
    def __init__(self, parser=MMPIBigTestParser()):
        super().__init__(parser)

    def get_service(self, test: TestBase) -> TestProcessor:
        return MMPITestProcessor(
            test=test,
            results_manager_factory=MMPIBigResultsManagerFactory(),
            verdict_calculator=VerdictCalculator(),
            scales_counter=ScalesCounter,
        )