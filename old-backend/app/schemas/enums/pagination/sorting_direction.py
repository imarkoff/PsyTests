from enum import Enum

from app.exceptions import ParseSortDirectionError


class SortingDirection(Enum):
    ASC = "asc"
    DESC = "desc"

    @staticmethod
    def parse(value: str) -> "SortingDirection":
        """
        Parses the sorting direction from a string value.
        :param value: The string value to parse.
        :return: The corresponding SortingDirection enum value.
        :raises ParseSortDirectionError: If the value is not a valid
        """
        upper_value = value.upper()
        try:
            return SortingDirection[upper_value]
        except ValueError:
            raise ParseSortDirectionError((
                f"Invalid sorting direction: {upper_value}. "
                "ASC or DESC expected."
            ))
