from app.utils.tests.mmpi.mmpi_question import MMPIQuestion
from app.utils.tests.mmpi.mmpi_scale import MMPIScale


class ScalesCounter:
    """Class to count the number of scales in the MMPI test."""
    def __init__(self, scales: list[MMPIScale]):
        self.scales = scales

    def count_from_questions(self, questions: list[MMPIQuestion]):
        scales_count = self._initialize_scales()

        for question in questions:
            for answer in question.answers:
                for label in answer.scales:
                    scales_count[label] += 1

        return scales_count

    def _initialize_scales(self):
        return {scale.label: 0 for scale in self.scales}