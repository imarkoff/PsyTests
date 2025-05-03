class CountInterpreter:
    """Gets a verdict for PCL-5 test based on count result"""

    def __init__(self, count_interpretations: dict[str, str]):
        self.count_interpretations = count_interpretations

    def get(self, count_result: dict[str, int]) -> str | None:
        """Get verdict based on total count and interpretation ranges"""
        total_count = sum(count_result.values())

        for count_range, verdict in self.count_interpretations.items():
            if self._is_in_range(total_count, count_range):
                return verdict

        return None

    @staticmethod
    def _is_in_range(value: int, range_str: str) -> bool:
        if '-' in range_str:  # Range format: "10-20"
            low, high = map(int, range_str.split('-'))
            return low <= value <= high

        if range_str.endswith('+'):  # Minimum value: "30+"
            minimum = int(range_str[:-1])
            return value >= minimum

        # Single value: "15"
        return value == int(range_str)