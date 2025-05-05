from app.schemas.test_base import TestBase
from app.services.tests.test_parser import TestParser


class TestParserImpl(TestParser):
    def parse(self, data: dict) -> TestBase:
        return super().parse(data)