from typing import TypedDict

from app.domains.tests.stai.schemas.stai_verdict import STAIScaleVerdict
from app.domains.tests.stai.utils.score_converter import STAIConvertedResults
from app.utils.range_validator import RangeValidator


class VerdictDetails(TypedDict):
    mark: str
    verdict: str | None


STAIVerdictsType = dict[str, dict[str, VerdictDetails]]


class VerdictInterpreter:
    def __init__(self, verdicts: STAIVerdictsType, range_validator: RangeValidator) -> None:
        self.verdicts = verdicts
        self.range_validator = range_validator

    def interpret(self, score: STAIConvertedResults) -> list[STAIScaleVerdict]:
        """
        Interpret the score based on the provided verdicts.
        """
        verdicts = []

        for scale, result in score.items():
            verdict = self._get_verdict_for_result(result)
            verdicts.append(STAIScaleVerdict(
                scale_label=scale,
                mark=verdict.get("mark") if verdict else None,
                verdict=verdict.get("verdict") if verdict else None
            ))

        return verdicts

    def _get_verdict_for_result(self, result: int) -> dict[str, VerdictDetails] | None:
        """
        Get the verdict for a specific result.
        """
        for range_str, verdict in self.verdicts.items():
            if self.range_validator.is_in_range(result, range_str):
                return verdict
        return None
