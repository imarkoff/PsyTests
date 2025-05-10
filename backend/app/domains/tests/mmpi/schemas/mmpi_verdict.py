from pydantic import ConfigDict

from app.domains.tests.base.test_verdict import TestVerdict
from app.domains.tests.mmpi.utils.profile_detector.get_verdicts import ScaleVerdicts
from app.domains.tests.mmpi.utils.results_manager.abstract_results_converter import ConvertedResults
from app.domains.tests.mmpi.utils.results_manager.results_counter import RawResults


class MMPIVerdict(TestVerdict):
    raw: RawResults
    converted: ConvertedResults
    scale_verdicts: ScaleVerdicts
    profile_types: list[str]
    profile_inclinations: list[str]

    model_config = ConfigDict(
        json_schema_extra={
            "example": {
                "raw": {"L": 0, "F": 1, "K": 0, "1": 3, "2": 3, "3": 3, "4": 2, "6": 1, "7": 3, "8": 3, "9": 1},
                "converted": {"L": 39.0, "F": 39.28, "K": 28.0, "1": 35.0, "2": 37.45, "3": 24.19, "4": 9.67,
                              "6": 30.47, "7": 26.28, "8": 25.58, "9": 20.47},
                "scale_verdicts": {
                    "L": [
                        "Норма у літньому віці, як відображення вікових змін.",
                        "Профіль сумнівний"
                    ],
                },
                "profile_types": ["Утоплений", "Пікоподібний"],
                "profile_inclinations": ["Невротичний"]
            }
        }
    )
