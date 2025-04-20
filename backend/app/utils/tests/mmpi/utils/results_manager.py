from typing import TYPE_CHECKING

from app.schemas.pass_test import PassTestAnswers
from app.utils.tests.mmpi.utils.results_converter import ConvertedResults, ResultsConverter
from app.utils.tests.mmpi.utils.results_counter import RawResults, ResultsCounter

if TYPE_CHECKING:
    from app.utils.tests.mmpi.mmpi_test import MMPITest
else:
    MMPITest = "MMPITest"


class ResultsManagerFactory:
    """Factory class for creating ResultsManager instances."""
    counter_class: type[ResultsCounter] = ResultsCounter
    converter_class: type[ResultsConverter] = ResultsConverter

    def create(self, test: MMPITest, answers: PassTestAnswers) -> 'ResultsManager':
        return ResultsManager(test=test, answers=answers,
                              counter_class=self.counter_class,
                              converter_class=self.converter_class)


class ResultsManager:
    """Encapsulates the logic for ResultsCounter and ResultsConverter."""
    def __init__(self, test: MMPITest, answers: PassTestAnswers,
                 counter_class: type[ResultsCounter],
                 converter_class: type[ResultsConverter]):
        self.test = test
        self.answers = answers

        self._counter_class = counter_class
        self._converter_class = converter_class

    def count_and_convert(self) -> tuple[RawResults, ConvertedResults]:
        raw_results = self._count()
        converted_results = self._convert(raw_results)
        return raw_results, converted_results

    def _count(self) -> RawResults:
        counter = self._counter_class(test=self.test, answers=self.answers)
        return counter.count()

    def _convert(self, raw_results: RawResults) -> ConvertedResults:
        converter = self._converter_class(test=self.test, results=raw_results)
        return converter.convert()