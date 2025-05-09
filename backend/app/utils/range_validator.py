class RangeValidator:
    """
    A utility class to validate if a given integer
    falls within a specified range.
    """

    @staticmethod
    def is_in_range(value: int, range_str: str) -> bool:
        """
        Check if the given value is within the specified range.
        :param value: The integer value to check.
        :param range_str: The range string in the format "10-20", "30+", or "15".
        """

        if '-' in range_str:  # Range format: "10-20"
            low, high = map(int, range_str.split('-'))
            return low <= value <= high

        if range_str.endswith('+'):  # Minimum value: "30+"
            minimum = int(range_str[:-1])
            return value >= minimum

        # Single value: "15"
        return value == int(range_str)
