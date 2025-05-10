from pydantic import BaseModel, ConfigDict, RootModel


class RavenResultAnswer(BaseModel):
    user_answer: int | None
    correct_answer: int
    points: int


class RavenTestResults(RootModel[dict[str, list[RavenResultAnswer]]]):
    """
    Test results for a Raven test, organized by module.
    Contains user answers, correct answers, and points for each question.
    """

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "A": [
                    {
                        "correct_answer": 1,
                        "user_answer": 2,
                        "points": 1,
                    }
                ],
                "B": [
                    {
                        "correct_answer": 3,
                        "user_answer": 3,
                        "points": 1,
                    }
                ],
            }
        }
    )
