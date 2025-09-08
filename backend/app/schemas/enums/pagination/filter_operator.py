from enum import Enum

from app.exceptions import IncorrectFilterOperatorError


class FilterOperator(Enum):
    """Enumeration for filter operators."""
    EQ = "eq"
    NE = "ne"
    LT = "lt"
    GT = "gt"
    LE = "le"
    GE = "ge"
    LIKE = "like"
    CONTAINS = "contains"
    DOES_NOT_CONTAIN = "doesNotContain"
    EQUALS = "equals"
    DOES_NOT_EQUAL = "doesNotEqual"
    STARTS_WITH = "startsWith"
    ENDS_WITH = "endsWith"
    IS_EMPTY = "isEmpty"
    IS_NOT_EMPTY = "isNotEmpty"
    IS_ANY_OF = "isAnyOf"
    IS = "IS"
    NOT = "NOT"
    AFTER = "after"
    ON_OR_AFTER = "onOrAfter"
    BEFORE = "before"
    ON_OR_BEFORE = "onOrBefore"

    @staticmethod
    def parse(value: str) -> "FilterOperator":
        """
        Parses the filter operator from a string value.
        :param value: The string value to parse.
        :return: The corresponding FilterOperator enum value.
        :raises IncorrectFilterOperatorError:
            If the value is not a valid FilterOperator.
        """
        upper_value = value.upper()

        try:
            return FilterOperator[upper_value]
        except ValueError:
            raise IncorrectFilterOperatorError(
                f"Invalid filter operator: {upper_value}."
                f"Expected one of: {list(FilterOperator)}."
            )
