from app.domains.tests.base.test_base import TestBase
from app.domains.tests.pcl5.schemas.pcl5_answer import PCL5Answer
from app.domains.tests.pcl5.schemas.pcl5_criteria import PCL5Criteria
from app.domains.tests.pcl5.schemas.pcl5_question import PCL5Question


class PCL5Test(TestBase):
    criterion: list[PCL5Criteria]
    answers: list[PCL5Answer]
    questions: list[PCL5Question]
