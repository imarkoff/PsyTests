from app.schemas.test_base import TestBase
from app.services.tests.test_factory import TestFactory
from app.services.tests.test_service import TestService
from app.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.tests.pcl5.services.pcl5_parser import PCL5TestParser
from app.tests.pcl5.services.pcl5_service import PCL5TestService
from app.tests.pcl5.utils.verdict_getter.verdict_getter_builder import VerdictGetterBuilder


class PCL5TestFactory(TestFactory):
    def __init__(self, parser = PCL5TestParser):
        super().__init__(parser)

    def get_model(self, data: dict) -> PCL5Test:
        return self.parser.parse(data)

    def get_service(self, test: TestBase) -> TestService:
        verdict_getter_builder = VerdictGetterBuilder(test=test)
        return PCL5TestService(
            test=test,
            verdict_getter=verdict_getter_builder.build(),
        )