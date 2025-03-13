from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from app.utils.tests.mmpi.mmpi_test import MMPITest
else:
    MMPITest = "MMPITest"

type RawResults = dict[str, int]
type ConvertedResults = dict[str, float]


def calculate_results(test: MMPITest, answers: dict[str, list[int | None]]) -> RawResults:
    """
    Calculate results for each scale
    """

    results = {scale.label: 0 for scale in test.scales}

    for i, question in enumerate(test.questions):
        patient_answer = None
        if answers["_"][i] == 0:
            patient_answer = True
        elif answers["_"][i] == 1:
            patient_answer = False

        for answer in question.answers:
            for label in answer.scales:
                results[label] += 1 if answer.answer == patient_answer else 0

    return results


def convert_results(test: MMPITest, results: dict[str, int]) -> ConvertedResults:
    """
    Convert calculated results to scale values
    """

    converted: dict[str, float] = {}
    scales_count = test.count_scale_questions()

    for scale in test.scales:
        result = results[scale.label]
        multiplier = 0

        if scale.multiply:
            multiplier = results[scale.multiply.scale] * scale.multiply.multiplier

        result_percent = (result + multiplier) / (scales_count[scale.label] + multiplier)
        converted[scale.label] = scale.min + (scale.max - scale.min) * result_percent

    return converted