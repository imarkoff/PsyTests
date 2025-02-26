from pydantic import RootModel, ConfigDict

MarksRow = dict[str, str | int | None]
Marks = list[MarksRow]

class TestMarks(RootModel[Marks]):
    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "5": {
                    "8": 81,
                    "8.5": 76,
                    "9": 73,
                    "9.5": 67,
                    "10": 64,
                    "10.5": 61,
                    "11": 59,
                    "11.5": 57,
                    "12": 55,
                    "12.5": 54,
                    "13": 53,
                    "13.5": 52,
                    "14": None,
                    "_": 6
                }
            }
        }
    )

    @classmethod
    def from_marks(cls, marks: Marks) -> 'TestMarks':
        return cls.model_validate(marks)