from app.domains.tests.pcl5.schemas.pcl5_verdict import PCL5Verdict
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

    async def get_verdict(self, answers: PassTestAnswers, patient: UserDto) -> PCL5Verdict:
        return self._verdict_getter.get_verdict(answers)

    async def get_marks_system(self):
        return {
            "count_interpretations": get_count_verdicts()
        }

    @staticmethod
    def get_document_generator():
        return PCL5ToDocx
