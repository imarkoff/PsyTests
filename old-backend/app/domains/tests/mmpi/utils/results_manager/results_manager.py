from typing import TYPE_CHECKING

from app.schemas.pass_test import PassTestAnswers
from app.schemas.enums.user_gender import UserGender
from app.domains.tests.mmpi.utils.results_manager.results_converter import ResultsConverter
from app.domains.tests.mmpi.utils.results_manager.abstract_results_converter import AbstractResultsConverter, \
    ConvertedResults
from app.domains.tests.mmpi.utils.results_manager.results_counter import RawResults, ResultsCounter

if TYPE_CHECKING:
    from app.domains.tests.mmpi.schemas.mmpi_test import MMPITest
else:
    MMPITest = "MMPITest"


class ResultsManagerFactory:
    """Factory class for creating ResultsManager instances."""
    counter_class: type[ResultsCounter] = ResultsCounter
    converter_class = ResultsConverter

    def create(self,
               test: MMPITest,
               scales_count: dict[str, int],
               answers: PassTestAnswers,
               gender: UserGender
               ) -> 'ResultsManager':
        return ResultsManager(test=test, scales_count=scales_count, answers=answers, gender=gender,
                              counter_class=self.counter_class,
                              converter_class=self.converter_class)


class ResultsManager:
    """Encapsulates the logic for ResultsCounter and ResultsConverter."""
    def __init__(self, test: MMPITest, scales_count: dict[str, int], answers: PassTestAnswers, gender: UserGender,
                 counter_class: type[ResultsCounter],
                 converter_class: type[AbstractResultsConverter]):
        self.test = test
        self.scales_count = scales_count
        self.answers = answers
        self.gender = gender

        self._counter_class = counter_class
        self._converter_class = converter_class

    def count_and_convert(self) -> tuple[RawResults, ConvertedResults]:
        raw_results = self._count()
        converted_results = self._convert(raw_results)
        return raw_results, converted_results

    def _count(self) -> RawResults:
        counter = self._counter_class(test=self.test, answers=self.answers, gender=self.gender)
        return counter.count()

    def _convert(self, raw_results: RawResults) -> ConvertedResults:
        converter = self._converter_class(test=self.test, scales_count=self.scales_count, results=raw_results, gender=self.gender)
        return converter.convert()