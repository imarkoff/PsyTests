from app.utils.range_validator import RangeValidator


class VerdictInterpreter:
    def __init__(self, interpretations: dict[str, str], range_validator: RangeValidator):
        self.interpretations = interpretations
        self.range_validator = range_validator

    def interpret(self, total_mark: int) -> str | None:
        """Get verdict based on total mark and interpretation ranges"""
        for count_range, verdict in self.interpretations.items():
            if self.range_validator.is_in_range(total_mark, count_range):
                return verdict

        return None
