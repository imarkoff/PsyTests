from app.domains.tests.raven.schemas.test_history_results import Results, Answer


class ResultsAnalyzer:
    """Analyzes test results data"""

    def __init__(self, results: Results):
        self.results = results

    def get_max_answers(self) -> int:
        max_answers = 0
        for module, answers in self.results.items():
            if len(answers) > max_answers:
                max_answers = len(answers)
        return max_answers

    @staticmethod
    def calculate_module_points(answers: list[Answer]):
        module_correct_points = 0
        module_total_points = 0

        for answer in answers:
            user_answer = answer["user_answer"]
            correct_answer = answer["correct_answer"]
            points = answer["points"]

            module_total_points += points
            if user_answer == correct_answer:
                module_correct_points += points

        return module_correct_points, module_total_points
