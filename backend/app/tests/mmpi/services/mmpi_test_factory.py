from app.schemas.test_base import TestBase
from app.services.tests.test_factory import TestFactory
from app.services.tests.test_service import TestService
from app.tests.mmpi.mmpi_test import MMPITest
from app.tests.mmpi.services.mmpi_test_parser import MMPITestParser
from app.tests.mmpi.services.mmpi_test_service import MMPITestService
from app.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory
from app.tests.mmpi.utils.scales_counter import ScalesCounter
from app.tests.mmpi.utils.verdict_calculator import VerdictCalculator


class MMPITestFactory(TestFactory):
    def __init__(self, parser=MMPITestParser):
        super().__init__(parser)

    def get_model(self, data: dict) -> MMPITest:
        return self.parser.parse(data)

    def get_service(self, test: TestBase) -> TestService:
        return MMPITestService(
            test=test,
            results_manager_factory=ResultsManagerFactory(),
            verdict_calculator=VerdictCalculator(),
            scales_counter=ScalesCounter
        )
