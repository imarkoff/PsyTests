from app.utils.tests.mmpi.utils.calculate_util import ConvertedResults
import app.utils.tests.mmpi.verdicts as verdicts


async def get_profile_types(results: ConvertedResults) -> list[str]:
    """
    Get profile types for MMPI
    """

    profile_types = verdicts.get_profile_types()

    detected_types = []

    checks = {
        "linear": lambda: is_linear(results),
        "drowned": lambda: is_drowned(results),
        "boundary": lambda: is_boundary(results),
        "peak_like": lambda: is_peak_like(results),
        "widely_scattered": lambda: is_widely_scattered(results),
        "highly_located": lambda: is_highly_located(results),
        "floating": lambda: is_floating(results),
        "convex": lambda: is_convex(results),
        "toothed_saw": lambda: is_toothed_saw(results)
    }

    for profile_type, check in profile_types.items():
        fun_to_check = checks.get(profile_type)
        if fun_to_check and fun_to_check():
            detected_types.append(profile_type)

    return detected_types


def is_linear(results: ConvertedResults) -> bool:
    total_scales = len(results)
    linear_scales = sum(1 for result in results.values() if 45 <= result <= 55)
    percent_linear = linear_scales / total_scales

    return percent_linear >= 0.9


def is_drowned(results: ConvertedResults) -> bool:
    total_scales = len(results)
    drowned_scales = sum(1 for result in results.values() if 45 <= result)
    percent_drowned = drowned_scales / total_scales

    return percent_drowned >= 0.9


def is_boundary(results: ConvertedResults) -> bool:
    total_scales = len(results)
    boundary_scales = sum(1 for result in results.values() if 55 <= result <= 75)
    percent_boundary = boundary_scales / total_scales

    return percent_boundary >= 0.9


def is_peak_like(results: ConvertedResults) -> bool:
    average_result = sum(results.values()) / len(results)
    peak_scales = [result for result in results.values() if result-15 > average_result]

    return 1 <= len(peak_scales) <= 3


def is_widely_scattered(results: ConvertedResults) -> bool:
    start = [results.get(scale) for scale in ["1", "2", "3"] if results.get(scale) is not None]
    middle = [results.get(scale) for scale in ["4", "5", "6", "7"] if results.get(scale) is not None]
    end = [results.get(scale) for scale in ["8", "9", "0"] if results.get(scale) is not None]

    start_max = max(start)
    middle_max = max(middle)
    end_max = max(end)

    return start_max-15 > middle_max and end_max-15 > middle_max


def is_highly_located(results: ConvertedResults) -> bool:
    for scale, result in results.items():
        if result > 80:
            return True

    return False


def is_floating(results: ConvertedResults) -> bool:
    f_scale = results.get("F")

    if f_scale is None or f_scale < 65 or f_scale > 90:
        return False

    check_scales = [results.get(scale) for scale in ["1", "2", "3", "7", "8"] if results.get(scale) is not None]
    other_scales = [results.get(scale) for scale in ["4", "5", "6", "9", "0"] if results.get(scale) is not None]

    if len(check_scales) == 0 or len(other_scales) == 0:
        return False

    for scale in check_scales:
        if scale < 70:
            return False

    for scale in other_scales:
        if scale <= 55:
            return False

    return True


def is_convex(results: ConvertedResults) -> bool:
    start = [results.get(scale) for scale in ["1", "2", "3"] if results.get(scale) is not None]
    middle = [results.get(scale) for scale in ["4", "5", "6", "7"] if results.get(scale) is not None]
    end = [results.get(scale) for scale in ["8", "9", "0"] if results.get(scale) is not None]

    start_max = sum(start) / len(start)
    middle_max = sum(middle) / len(middle)
    end_max = sum (end) / len(end)

    return start_max < middle_max and end_max < middle_max


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

