from app.domains.tests.raven.schemas.question import Question
from app.domains.tests.raven.schemas.raven_test import RavenTest
from app.domains.tests.raven.schemas.test_history_results import RavenTestResults, RavenResultAnswer


def convert_results(test: RavenTest, result: dict[str, list[int]]) -> RavenTestResults:
    """
    Convert test results to DTO
    """

    modules = {}

    for module, answers in result.items():
        answers_list = []

        questions: list[Question] = test.get_module(module).questions if module != "_" else test.questions

        for i, answer in enumerate(answers):
            correct_answer: int = find_correct_answer_index(questions[i])
            points: int | None = questions[i].points

            answers_list.append(
                RavenResultAnswer(
                    user_answer=answer,
                    correct_answer=correct_answer if correct_answer is not None else -1,
                    points=points if points is not None else 0
                )
            )

        modules[module] = answers_list

    return RavenTestResults.model_validate(modules)


def find_correct_answer_index(question: Question) -> int | None:
    """
    Find correct answer
    """

    for i, answer in enumerate(question.answers):
        if answer.is_correct:
                return i

    return None