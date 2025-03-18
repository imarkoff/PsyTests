from typing import Optional, Type

from pydantic import BaseModel, ConfigDict, UUID4, Field

from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_auth import UserDto


class TestBase(BaseModel):
    """
    Base test model. Also used for showing base test information.
    Should be inherited by all test models.
    """

    id: UUID4 = Field(..., title="ID")
    name: str = Field(..., title="Name")
    type: str = Field(..., title="Type of the test. Based on this field, the test class will be selected")
    description: Optional[str] = Field(None, title="Description")
    marks_path: Optional[str] = Field(None, title="Marks path")
    marks_unit: Optional[str] = Field(None, title="Measurement unit")

    model_config = ConfigDict(
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "id": "399738b5-7f16-44b7-8e75-314a65e75868",
                "name": "IQ test",
                "type": "raven",
                "description": "Test for measuring intelligence",
                "marks_path": "marks.csv",
                "marks_unit": "IQ"
            }
        }
    )

    @classmethod
    def from_json(cls, test_data: dict) -> 'TestBase':
        """
        Create test class based on json data
        """
        return cls(
            id=test_data.get("id"),
            name=test_data.get("name"),
            type=test_data.get("type"),
            description=test_data.get("description", None),
            marks_path=test_data.get("marks", None),
            marks_unit=test_data.get("marks_unit", None)
        )

    def hide_correct_answers(self):
        """
        Hide correct answers or specific data
        what should not be shown to the patient
        """
        pass

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        """
        Function to convert answers to test history
        """
        return TestHistory(
            test_id=self.id,
            patient_id=patient.id,
            results=answers,  # can be converted for test needs or left as is
            verdict=None      # is just a dict where you can put any data based on the test needs
        )

    async def revalidate_test(self, test_history: TestHistory):
        """
        Revalidate test results.
        Can be used to recalculate results after changes in the test.
        """
        test_history.results = test_history.results

    async def get_marks_system(self) -> None:
        """
        Get marks system. Normally returns json data.
        You may need this or not, depending on the test type.
        """
        return None

    @staticmethod
    def get_document_generator() -> Type[any]:
        """
        Get document generator class
        """
        from app.utils.results_to_docx import ResultsToDocx
        return ResultsToDocx