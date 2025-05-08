from app.db.models.test_history import TestHistory
from app.schemas.pass_test import PassTestAnswers
from app.schemas.user_auth import UserDto
from app.domains.tests.base.test_processor import TestProcessor
from app.domains.tests.pcl5.schemas.pcl5_test import PCL5Test
from app.domains.tests.pcl5.to_docx.pcl5_to_docx import PCL5ToDocx
from app.domains.tests.pcl5.utils.verdict_getter.verdict_getter import VerdictGetter
from app.domains.tests.pcl5.verdicts import get_count_verdicts


class PCL5TestProcessor(TestProcessor):
    def __init__(self, test: PCL5Test, verdict_getter: VerdictGetter):
        super().__init__(test)
        self._verdict_getter = verdict_getter

    def hide_correct_answers(self):
        return self.test

    async def pass_test(self, answers: PassTestAnswers, patient: UserDto) -> TestHistory:
        verdict = self._verdict_getter.get_verdict(answers)
        return TestHistory(
            test_id=self.test.id,
            patient_id=patient.id,
            results=answers,
            verdict=verdict.model_dump()
        )

    async def revalidate_test(self, test_history: TestHistory):
        verdict = self._verdict_getter.get_verdict(test_history.results)
        test_history.verdict = verdict.model_dump()

    async def get_marks_system(self):
        return {
            "count_interpretations": get_count_verdicts()
        }

    @staticmethod
    def get_document_generator():
        return PCL5ToDocx
