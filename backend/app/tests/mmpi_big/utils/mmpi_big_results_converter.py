import yaml

from app.tests.mmpi_big.verdicts import average_data_path
from app.tests.mmpi.utils.results_manager.abstract_results_converter import AbstractResultsConverter, \
    ConvertedResults


class MMPIBigResultsConverter(AbstractResultsConverter):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.average_data = self._get_average_data()

    @staticmethod
    def _get_average_data() -> dict:
        with open(average_data_path, "r") as file:
            return yaml.load(file, Loader=yaml.FullLoader)

    def convert(self) -> ConvertedResults:
        """Convert raw results to scale values"""
        converted: dict[str, float] = {}

        for scale in self.test.scales:
            converted[scale.label] = self._convert_single_scale(scale)

        return converted

    def _convert_single_scale(self, scale) -> float:
        """Convert a single scale's raw result to T-score"""
        raw_result = self.results[scale.label]
        average_data = self._get_scale_average_data(scale.label)

        return self._calculate_t_score(raw_result, average_data)

    def _get_scale_average_data(self, scale_label: str) -> dict:
        """Get gender-specific average data for a scale"""
        return self.average_data[scale_label][self.gender]

    @staticmethod
    def _calculate_t_score(raw_result: int, average_data: dict) -> float:
        """Calculate T-score using the formula: 50 + (10 * (raw - median) / sigma)"""
        median = average_data["median"]
        sigma = average_data["sigma"]

        return 50 + (10 * (raw_result - median) / sigma)