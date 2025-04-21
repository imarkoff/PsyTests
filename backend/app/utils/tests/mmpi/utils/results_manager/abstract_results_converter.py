from abc import ABC, abstractmethod
from typing import TYPE_CHECKING, TypeAlias

from app.schemas.user_gender import UserGender
from app.utils.tests.mmpi.utils.results_manager.results_counter import RawResults

if TYPE_CHECKING:
    from app.utils.tests.mmpi.mmpi_test import MMPITest
else:
    MMPITest = "MMPITest"

ConvertedResults: TypeAlias = dict[str, float]


class AbstractResultsConverter(ABC):
    def __init__(self, test: MMPITest, results: RawResults, gender: UserGender = None):
        self.test = test
        self.results = results
        self.gender = gender

    @abstractmethod
    def convert(self) -> ConvertedResults:
        """Convert raw results to scale values"""
        ...
