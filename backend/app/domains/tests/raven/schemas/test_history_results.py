from pydantic import BaseModel, ConfigDict, RootModel


class Answer(BaseModel):
    user_answer: int | None
    correct_answer: int
    points: int


class Results(RootModel[dict[str, list[Answer]]]):
    """
    Test results for a single test.
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