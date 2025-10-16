from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.bdi.services.bdi_parser import BDITestParser
from app.domains.tests.bdi.services.bdi_processor import BDITestProcessor
from app.domains.tests.bdi.utils.verdict_getter_builder import VerdictGetterBuilder


class BDITestFactory(TestFactory):
    def __init__(self, parser=BDITestParser()):
        super().__init__(parser)

    def get_service(self, test: TestBase) -> TestProcessor:
        verdict_getter = VerdictGetterBuilder(test=test).build()
        return BDITestProcessor(
            test=test,
            verdict_getter=verdict_getter
        )
