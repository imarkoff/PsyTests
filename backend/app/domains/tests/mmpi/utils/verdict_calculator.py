from app.domains.tests.mmpi.schemas.mmpi_verdict import MMPIVerdict
from app.domains.tests.mmpi.utils.profile_detector.get_profile_inclinations import get_profile_inclinations
from app.domains.tests.mmpi.utils.profile_detector.get_profile_types import get_profile_types
from app.domains.tests.mmpi.utils.profile_detector.get_verdicts import get_verdicts
from app.domains.tests.mmpi.utils.results_manager.abstract_results_converter import ConvertedResults
from app.domains.tests.mmpi.utils.results_manager.results_counter import RawResults


class VerdictCalculator:
    @staticmethod
    async def calculate(raw_results: RawResults, converted_results: ConvertedResults) -> MMPIVerdict:
        return MMPIVerdict(
            raw=raw_results,
            converted=converted_results,
            scale_verdicts=await get_verdicts(converted_results),
            profile_types=await get_profile_types(converted_results),
            profile_inclinations=await get_profile_inclinations(converted_results)
        )
