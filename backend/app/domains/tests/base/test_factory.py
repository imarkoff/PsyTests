from abc import ABC, abstractmethod
from dataclasses import dataclass

from app.domains.tests.base.test_base import TestBase
from app.domains.tests.base.test_parser import TestParser
from app.domains.tests.base.test_processor import TestProcessor


@dataclass
class TestBundle:
    model: TestBase
    service: TestProcessor


class TestFactory(ABC):
    """
    Factory to create a test model from model and its service.
    Also, should resolve dependencies for a service.
    """

    def __init__(self, parser: TestParser = None):
        if parser is None:
            raise ValueError("Parser must be provided")
        self.parser = parser

    def get(self, data: dict) -> TestBundle:
        test = self.get_model(data)
        service = self.get_service(test)
        return TestBundle(
            model = test,
            service = service,
        )

    @abstractmethod
    def get_model(self, data: dict) -> TestBase:
        return self.parser.parse(data)

    @abstractmethod
    def get_service(self, test: TestBase) -> TestProcessor:
        return TestProcessor(test)