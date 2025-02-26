from app.schemas.test.test import Test


async def calculate_points(test: Test, answers: dict[str, list[int]]) -> tuple[int, int]:
    """
    Calculate points for test
    """

    total_points = 0
    correct_points = 0

    for key, module in answers.items():
        questions = test.get_module(key).questions if key != "_" else test.questions
        for i, answer in enumerate(module):
            question = questions[i]
            points = question.points if question.points else 1
            total_points += points

            if answer is not None and question.answers[answer].is_correct:
                correct_points += points

    return total_points, correct_points