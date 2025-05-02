from app.schemas.test_base import TestBase
from app.services.tests.test_factory import TestFactory
from app.services.tests.test_parser_impl import TestParserImpl
from app.services.tests.test_service_impl import TestServiceImpl


class TestFactoryImpl(TestFactory):
    def __init__(self, parser = TestParserImpl()):
        super().__init__(parser)

    def get_model(self, data: dict):
        return super().get_model(data)

    def get_service(self, test: TestBase):
        return TestServiceImpl(test)