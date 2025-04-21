from typing import TYPE_CHECKING

from app.schemas.user_gender import UserGender
from app.utils.tests.mmpi.mmpi_scale import MMPIScale
from app.utils.tests.mmpi.utils.results_manager.abstract_results_converter import AbstractResultsConverter, \
    ConvertedResults
from app.utils.tests.mmpi.utils.results_manager.results_counter import RawResults

if TYPE_CHECKING:
    from app.utils.tests.mmpi.mmpi_test import MMPITest
else:
    MMPITest = "MMPITest"


class ResultsConverter(AbstractResultsConverter):
    """Convert MMPI test results to scale values"""
    def __init__(self, test: MMPITest, results: RawResults, gender: UserGender = None):
        """
        :param test: MMPI test
        :param results: Raw results from the test
        """
        super().__init__(test, results, gender)
        self.scales_count = self.test.count_scales_by_questions()

    def convert(self) -> ConvertedResults:
        """Convert raw results to scale values"""
        converted: dict[str, float] = {}

        for scale in self.test.scales:
            result = self.results[scale.label]
            multiplier = self._get_multiplier(scale)
            converted[scale.label] = self._calculate_converted_result(result, multiplier, scale)

        return converted

    def _get_multiplier(self, scale: MMPIScale) -> float:
        multiplier = 0
        if scale.multiply:
            multiplier = self.results[scale.multiply.scale] * scale.multiply.multiplier
        return multiplier

    def _calculate_converted_result(self, result: int, multiplier: float, scale: MMPIScale) -> float:
        scale_count = self.scales_count[scale.label]
        result_percent = (result + multiplier) / (scale_count + multiplier)
        return scale.min + (scale.max - scale.min) * result_percent