from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.pcl5.services.pcl5_parser import PCL5TestParser
from app.domains.tests.pcl5.services.pcl5_service import PCL5TestProcessor
from app.domains.tests.pcl5.utils.verdict_getter.verdict_getter_builder import VerdictGetterBuilder


class PCL5TestFactory(TestFactory):
    def __init__(self, parser=PCL5TestParser()):
        super().__init__(parser)

    def get_service(self, test: TestBase) -> TestProcessor:
        verdict_getter_builder = VerdictGetterBuilder(test=test)
        return PCL5TestProcessor(
            test=test,
            verdict_getter=verdict_getter_builder.build(),
        )
