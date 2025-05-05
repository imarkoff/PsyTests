from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_parser import TestParser


class TestParserImpl(TestParser):
    def parse(self, data: dict) -> TestBase:
        return super().parse(data)