from app.utils.tests.mmpi.utils.calculate_util import ConvertedResults
from app.utils.tests.mmpi.verdicts import scale_verdicts
from yaml import load

try:
    from yaml import CLoader as Loader
except ImportError:
    from yaml import Loader


async def get_verdicts(results: ConvertedResults):
    """
    Get verdicts for each scale
    """

    verdicts = {}
    verdicts_file: dict[str, dict[str, str]] = load(open(scale_verdicts), Loader=Loader)

    for scale, value in results.items():
        verdict = verdicts_file.get(scale)
        if verdict:
            patient_scale_verdicts = get_scale_verdicts(value, verdict)
            if len(patient_scale_verdicts) > 0:
                verdicts[scale] = patient_scale_verdicts

    return verdicts


def get_scale_verdicts(value: float, verdict: dict[str, str]) -> list[str]:
    ranges = []
    for key, val in verdict.items():
        verdict_range = key.split('-')
        if is_value_in_range(value, verdict_range):
            ranges.append(val)
    return ranges


def is_value_in_range(value: float, verdict_range: list[str]) -> bool:
    if len(verdict_range) == 1:
        if "+" in verdict_range[0]:
            if value >= int(verdict_range[0][:-1]):
                return True
        elif int(value) == int(verdict_range[0]):
            return True

    elif int(verdict_range[0]) <= value <= int(verdict_range[1]):
        return True

    return False
