from app.schemas.test_base import TestBase
from app.services.tests.test_factory import TestFactory
from app.tests.raven.raven_test import RavenTest
from app.tests.raven.services.raven_test_parser import RavenTestParser
from app.tests.raven.services.raven_test_service import RavenTestService


class RavenTestFactory(TestFactory):
    def __init__(self, parser = RavenTestParser):
        super().__init__(parser)

    def get_model(self, data: dict) -> RavenTest:
        return self.parser.parse(data)

    def get_service(self, test: TestBase) -> RavenTestService:
        return RavenTestService(test)