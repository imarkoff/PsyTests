from app.schemas.pass_test import PassTestAnswers
from app.tests.pcl5.schemas.pcl5_test import PCL5Test


class CriterionCounter:
    """Counts patient results for PCL5 test by each criterion"""

    def __init__(self, test: PCL5Test):
        self.test = test

    def count(self, answers: PassTestAnswers) -> dict[str, int]:
        total_count = self._define_counts_for_countable_criterion()

        for i, answer in enumerate(answers):
            test_question = self.test.questions[i]
            test_criteria = test_question.criteria
            criteria_count = total_count.get(test_criteria, None)

            if criteria_count is not None:
                total_count[test_criteria] += answer

        return total_count


    def _define_counts_for_countable_criterion(self) -> dict[str, int]:
        count = {}

        for criteria in self.test.criterion:
            if criteria.countable:
                count[criteria.criteria] = 0

        return count
