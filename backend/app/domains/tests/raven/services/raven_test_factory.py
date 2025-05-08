from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_factory import TestFactory
from app.domains.tests.raven.schemas.raven_test import RavenTest
from app.domains.tests.raven.services.raven_test_parser import RavenTestParser
from app.domains.tests.raven.services.raven_test_service import RavenTestProcessor


class RavenTestFactory(TestFactory):
    def __init__(self, parser = RavenTestParser):
        super().__init__(parser)

    def get_model(self, data: dict) -> RavenTest:
        return self.parser.parse(data)

    def get_service(self, test: TestBase) -> RavenTestProcessor:
        return RavenTestProcessor(test)