from app.utils.range_validator import RangeValidator


class CountInterpreter:
    """Gets a verdict for PCL-5 test based on count result"""

    def __init__(self, count_interpretations: dict[str, str], range_validator: RangeValidator):
        self.count_interpretations = count_interpretations
        self.range_validator = range_validator

    def get(self, count_result: dict[str, int]) -> str | None:
        """Get verdict based on total count and interpretation ranges"""
        total_count = sum(count_result.values())

        for count_range, verdict in self.count_interpretations.items():
            if self.range_validator.is_in_range(total_count, count_range):
                return verdict

        return None
