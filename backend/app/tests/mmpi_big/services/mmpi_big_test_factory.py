from app.schemas.test_base import TestBase
from app.services.tests.test_factory import TestFactory
from app.services.tests.test_service import TestService
from app.tests.mmpi.services.mmpi_test_service import MMPITestService
from app.tests.mmpi.utils.scales_counter import ScalesCounter
from app.tests.mmpi.utils.verdict_calculator import VerdictCalculator
from app.tests.mmpi_big.mmpi_big import MMPIBigTest
from app.tests.mmpi_big.services.mmpi_big_test_parser import MMPIBigTestParser
from app.tests.mmpi_big.utils.mmpi_big_results_manager_factory import MMPIBigResultsManagerFactory


class MMPIBigTestFactory(TestFactory):
    def __init__(self, parser = MMPIBigTestParser):
        super().__init__(parser)

    def get_model(self, data: dict) -> MMPIBigTest:
        return self.parser.parse(data)

    def get_service(self, test: TestBase) -> TestService:
        return MMPITestService(
            test=test,
            results_manager_factory=MMPIBigResultsManagerFactory(),
            verdict_calculator=VerdictCalculator(),
            scales_counter=ScalesCounter,
        )