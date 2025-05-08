from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.base.services.test_parser_impl import TestParserImpl
from app.domains.tests.base.services.test_service_impl import TestProcessorImpl


class TestFactoryImpl(TestFactory):
    def __init__(self, parser = TestParserImpl()):
        super().__init__(parser)

    def get_model(self, data: dict):
        return super().get_model(data)

    def get_service(self, test: TestBase):
        return TestProcessorImpl(test)
