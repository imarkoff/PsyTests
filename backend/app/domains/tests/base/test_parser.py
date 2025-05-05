from abc import ABC, abstractmethod

from app.domains.tests.base.test_base import TestBase


class TestParser(ABC):
    @classmethod
    @abstractmethod
    def parse(cls, data: dict) -> TestBase:
        """Creates a pydantic model from a dict"""

        return TestBase(
            id=data.get("id"),
            name=data.get("name"),
            type=data.get("type"),
            description=data.get("description", None),
            marks_path=data.get("marks", None),
            marks_unit=data.get("marks_unit", None)
        )