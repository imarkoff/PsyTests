from app.utils.tests.mmpi.utils.profile_detector import ProfileDetector
from app.utils.tests.mmpi.utils.results_converter import ConvertedResults

detector = ProfileDetector()


async def get_profile_inclinations(results: ConvertedResults) -> list[str]:
    """
    Get profile inclination for MMPI
    """

    return await detector.get_profile_inclinations(results)


def get_scales(results: ConvertedResults, scales: list[str]) -> list[float]:
    return [results.get(scale) for scale in scales if results.get(scale) is not None]


@detector.register_inclination("neurotic")
def is_neurotic(results: ConvertedResults) -> bool:
    neurotic_scales = get_scales(results, ["1", "2", "3"])
    avg_neurotic = sum(neurotic_scales) / len(neurotic_scales)
    if avg_neurotic >= 60: return True

    other_scales = get_scales(results, ["7", "8"])
    avg_other = sum(other_scales) / len(other_scales)
    return avg_neurotic >= 50 and avg_other >= 60


@detector.register_inclination("positive")
def is_positive(results: ConvertedResults) -> bool:
    behavioral_scales = get_scales(results, ["4", "6", "8", "9"])
    avg_behavioral = sum(behavioral_scales) / len(behavioral_scales)
    return avg_behavioral >= 60


@detector.register_inclination("double-peak")
def is_double_peak(results: ConvertedResults) -> bool:
    prev: tuple[str, float] | None = None
    for i, (scale, result) in enumerate(results.items()):
        prev = (scale, result)
        if i == 0: continue

        if (result + prev[1]) / 2 >= 60:
            return True

    return False