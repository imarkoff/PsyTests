from abc import ABC, abstractmethod
from typing import TypeAlias

from app.schemas.enums.user_gender import UserGender
from app.domains.tests.mmpi.schemas.mmpi_test import MMPITest
from app.domains.tests.mmpi.utils.results_manager.results_counter import RawResults


ConvertedResults: TypeAlias = dict[str, float]


class AbstractResultsConverter(ABC):
    def __init__(self,
                 test: MMPITest,
                 scales_count: dict[str, int],
                 results: RawResults,
                 gender: UserGender | None
                 ):
        self.test = test
        self.scales_count = scales_count
        self.results = results
        self.gender = gender

    @abstractmethod
    def convert(self) -> ConvertedResults:
        """Convert raw results to scale values"""
        ...
