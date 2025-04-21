from typing import ClassVar, Type

from app.utils.tests.mmpi.mmpi_big.schemas.mmpi_big_results_manager_factory import MMPIBigResultsManagerFactory
from app.utils.tests.mmpi.mmpi_big.schemas.mmpi_big_scale import MMPIBigScale
from app.utils.tests.mmpi.mmpi_question import MMPIQuestion
from app.utils.tests.mmpi.mmpi_test import MMPITest
from app.utils.tests.mmpi.utils.results_manager.results_manager import ResultsManagerFactory


class MMPIBigTest(MMPITest):
    scales: list[MMPIBigScale]
    type: str = "mmpi_big"

    _results_manager_factory: ClassVar[ResultsManagerFactory] = MMPIBigResultsManagerFactory()

    @classmethod
    def from_json(cls, test_data: dict) -> 'MMPITest':
        return cls(
            id=test_data.get("id"),
            name=test_data.get("name"),
            scales=[MMPIBigScale(**scale_data) for scale_data in test_data.get('scales', [])],
            description=test_data.get("description", None),
            questions=[MMPIQuestion(**question_data) for question_data in test_data.get("questions", [])]
        )