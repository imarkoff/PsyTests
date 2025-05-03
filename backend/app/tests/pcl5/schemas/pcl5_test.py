from app.schemas.test_base import TestBase
from app.tests.pcl5.schemas.pcl5_answer import PCL5Answer
from app.tests.pcl5.schemas.pcl5_criteria import PCL5Criteria
from app.tests.pcl5.schemas.pcl5_question import PCL5Question


class PCL5Test(TestBase):
    criterion: list[PCL5Criteria]
    answers: list[PCL5Answer]
    questions: list[PCL5Question]
