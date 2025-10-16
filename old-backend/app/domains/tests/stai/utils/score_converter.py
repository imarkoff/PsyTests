from app.domains.tests.stai.schemas.stai_test import STAITest
from app.domains.tests.stai.utils.score_counter import STAICounterType


STAIConvertedResults = dict[str, int]


class ScoreConverter:
    def __init__(self, test: STAITest):
        self.test = test

    def convert(self, raw_results: STAICounterType) -> STAIConvertedResults:
        """
        Convert the raw results from the score counter into a more readable format.
        """
        converted_results: STAIConvertedResults = {}

        for scale_label, count_results in raw_results.items():
            scale = self.test.get_scale(scale_label)
            if scale:
                converted_results[scale_label] = self._calculate(
                    positive=count_results["positive"],
                    negative=count_results["negative"],
                    score_adjustment=scale.score_adjustment
                )

        return converted_results

    @staticmethod
    def _calculate(positive: int, negative: int, score_adjustment: int) -> int:
        return positive - negative + score_adjustment
