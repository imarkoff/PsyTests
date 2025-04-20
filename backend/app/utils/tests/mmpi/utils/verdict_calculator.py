from app.utils.tests.mmpi.utils.get_profile_inclinations import get_profile_inclinations
from app.utils.tests.mmpi.utils.get_profile_types import get_profile_types
from app.utils.tests.mmpi.utils.get_verdicts import get_verdicts
from app.utils.tests.mmpi.utils.results_converter import ConvertedResults
from app.utils.tests.mmpi.utils.results_counter import RawResults


class VerdictCalculator:
    @staticmethod
    async def calculate(raw_results: RawResults, converted_results: ConvertedResults) -> dict:
        return {
            "raw": raw_results,
            "converted": converted_results,
            "scale_verdicts": await get_verdicts(converted_results),
            "profile_types": await get_profile_types(converted_results),
            "profile_inclinations": await get_profile_inclinations(converted_results)
        }