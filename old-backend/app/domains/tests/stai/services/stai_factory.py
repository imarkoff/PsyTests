from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.stai.schemas.stai_test import STAITest
from app.domains.tests.stai.services.stai_parser import STAIParser
from app.domains.tests.stai.services.stai_processor import STAITestProcessor
from app.domains.tests.stai.utils.verdict_getter_builder import VerdictGetterBuilder


class STAITestFactory(TestFactory):
    def __init__(self, parser=STAIParser()):
        super().__init__(parser)

    def get_service(self, test: STAITest) -> STAITestProcessor:
        verdict_getter = VerdictGetterBuilder(test=test).build()
        return STAITestProcessor(
            test=test,
            verdict_getter=verdict_getter
        )
