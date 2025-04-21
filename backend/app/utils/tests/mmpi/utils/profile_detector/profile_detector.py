from typing import Callable, Dict

from app.utils.tests.mmpi.utils.results_manager.abstract_results_converter import ConvertedResults

CheckFunction = Callable[[ConvertedResults], bool]
ProfileChecks = Dict[str, CheckFunction]


class ProfileDetector:
    def __init__(self):
        self.checks: Dict[str, ProfileChecks] = {
            "types": {},
            "inclinations": {}
        }

    def register_type(self, name: str):
        def decorator(func: CheckFunction):
            self.checks["types"][name] = func
            return func

        return decorator

    def register_inclination(self, name: str):
        def decorator(func: CheckFunction):
            self.checks["inclinations"][name] = func
            return func

        return decorator

    async def get_profile_types(self, results: ConvertedResults) -> list[str]:
        import app.utils.tests.mmpi.verdicts as verdicts
        profile_types = verdicts.get_profile_types()
        return self._detect_profiles(results, profile_types, "types")

    async def get_profile_inclinations(self, results: ConvertedResults) -> list[str]:
        import app.utils.tests.mmpi.verdicts as verdicts
        profile_inclinations = verdicts.get_profile_inclinations()
        return self._detect_profiles(results, profile_inclinations, "inclinations")

    def _detect_profiles(self, results: ConvertedResults, profile_data: dict, check_type: str) -> list[str]:
        detected = []
        for profile_id, check_info in profile_data.items():
            check_func = self.checks[check_type].get(profile_id)
            if check_func and check_func(results):
                detected.append(check_info.get("name"))
        return detected