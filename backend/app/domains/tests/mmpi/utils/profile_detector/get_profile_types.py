from app.domains.tests.mmpi.utils.profile_detector.profile_detector import ProfileDetector
from app.domains.tests.mmpi.utils.results_manager.abstract_results_converter import ConvertedResults

detector = ProfileDetector()


async def get_profile_types(results: ConvertedResults) -> list[str]:
    """Get profile types for MMPI"""

    return await detector.get_profile_types(results)


def get_scales(results: ConvertedResults, scales: list[str]) -> list[float]:
    return [results.get(scale) for scale in scales if results.get(scale) is not None]


@detector.register_type("linear")
def is_linear(results: ConvertedResults) -> bool:
    total_scales = len(results)
    linear_scales = sum(1 for result in results.values() if 45 <= result <= 55)
    percent_linear = linear_scales / total_scales

    return percent_linear >= 0.9


@detector.register_type("drowned")
def is_drowned(results: ConvertedResults) -> bool:
    total_scales = len(results)
    drowned_scales = sum(1 for result in results.values() if result <= 45)
    percent_drowned = drowned_scales / total_scales

    return percent_drowned >= 0.9


@detector.register_type("boundary")
def is_boundary(results: ConvertedResults) -> bool:
    total_scales = len(results)
    boundary_scales = sum(1 for result in results.values() if 55 <= result <= 75)
    percent_boundary = boundary_scales / total_scales

    return percent_boundary >= 0.9


@detector.register_type("peak-like")
def is_peak_like(results: ConvertedResults) -> bool:
    average_result = sum(results.values()) / len(results)
    peak_scales = [result for result in results.values() if result-15 > average_result]

    return 1 <= len(peak_scales) <= 3


@detector.register_type("widely-scattered")
def is_widely_scattered(results: ConvertedResults) -> bool:
    start = get_scales(results, ["1", "2", "3"])
    middle = get_scales(results, ["4", "5", "6", "7"])
    end = get_scales(results, ["8", "9", "0"])

    start_max = max(start)
    middle_max = max(middle)
    end_max = max(end)

    return start_max-15 > middle_max and end_max-15 > middle_max


@detector.register_type("highly-located")
def is_highly_located(results: ConvertedResults) -> bool:
    for scale, result in results.items():
        if result > 80:
            return True

    return False


@detector.register_type("floating")
def is_floating(results: ConvertedResults) -> bool:
    f_scale = results.get("F")

    if f_scale is None or f_scale < 65 or f_scale > 90:
        return False

    check_scales = get_scales(results, ["1", "2", "3", "7", "8"])
    other_scales = get_scales(results, ["4", "5", "6", "9", "0"])

    if len(check_scales) == 0 or len(other_scales) == 0:
        return False

    for scale in check_scales:
        if scale < 70:
            return False

    for scale in other_scales:
        if scale <= 55:
            return False

    return True


@detector.register_type("convex")
def is_convex(results: ConvertedResults) -> bool:
    start = get_scales(results, ["1", "2", "3"])
    middle = get_scales(results, ["4", "5", "6", "7"])
    end = get_scales(results, ["8", "9", "0"])

    start_max = sum(start) / len(start)
    middle_max = sum(middle) / len(middle)
    end_max = sum (end) / len(end)

    return start_max+5 < middle_max and end_max < middle_max+5


@detector.register_type("toothed-saw")
def is_toothed_saw(results: ConvertedResults) -> bool:
    scales = [(scale, result) for scale, result in results.items() if result is not None]

    rates: list[int] = []

    for i, (scale, result) in enumerate(scales):
        if i % 2 == 0:
            continue

        if 7 <= abs(result - scales[i-1][1]) <= 10:
            rates.append(1)
        else:
            rates.append(0)

    return sum(rates) >= 3
