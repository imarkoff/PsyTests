from enum import Enum
from typing import Literal
from pydantic import BaseModel, ConfigDict, computed_field

from app.exceptions import (
    IncorrectFilterOperatorError,
    ParseSortDirectionError
)


class PaginationParams(BaseModel):
    """Pagination parameters for API responses."""

    limit: int = 10
    """Number of items per page"""

    offset: int = 0
    """Page number starting from 0"""

    sorted_fields: list["SortedField"]
    """Sorted fields and directions"""

    quick_filter: list[str] = []
    """Quick search for all fields"""

    quick_filter_operator: Literal["AND", "OR"] = "AND"
    """
    Operator to use for the quick filter.
    AND - all terms must match
    OR - any term must match
    """

    filters: list["Filter"] = []
    """
    Additional filters for the query.
    Separated by spaces in the following format:
    field:operator:value
    """

    filter_logic_operator: Literal["AND", "OR"] = "AND"
    """
    Operator to use for the filters.
    AND - all filters must match
    OR - any filter must match
    """


class SortedField(BaseModel):
    field: str
    direction: "SortingDirection"


class Filter(BaseModel):
    field: str
    operator: str
    value: str | int | float | bool | None


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

    @staticmethod
    def parse(value: str) -> "FilterOperator":
        """
        Parses the filter operator from a string value.
        :param value: The string value to parse.
        :return: The corresponding FilterOperator enum value.
        :raises IncorrectFilterOperatorError:
            If the value is not a valid FilterOperator.
        """
        try:
            return FilterOperator(value.upper())
        except ValueError:
            raise IncorrectFilterOperatorError(
                f"Invalid filter operator: {value}."
                f"Expected one of: {list(FilterOperator)}."
            )


class SortingDirection(Enum):
    ASC = "asc"
    DESC = "desc"

    @staticmethod
    def parse(value: str) -> "SortingDirection":
        """
        Parses the sorting direction from a string value.
        :param value: The string value to parse.
        :return: The corresponding SortingDirection enum value.
        :raises ValueError: If the value is not a valid
        """
        upper_value = value.upper()
        try:
            return SortingDirection[upper_value]
        except ValueError:
            raise ParseSortDirectionError((
                f"Invalid sorting direction: {upper_value}. "
                "ASC or DESC expected."
            ))


class PaginatedList[T](PaginationParams):
    """
    Paginated list of items with pagination metadata.
    """

    data: list[T]
    """
    List of items for the current page.
    """

    total: int
    """
    Total number of items available.
    """

    @computed_field
    @property
    def has_next_page(self) -> bool:
        """
        Check if there is a next page.
        """
        return self.offset * self.limit < self.total

    @computed_field
    @property
    def has_previous_page(self) -> bool:
        """
        Check if there is a previous page.
        """
        return self.offset > 1

    @computed_field
    @property
    def total_pages(self) -> int:
        """
        Total number of pages.
        """
        return (self.total + self.limit - 1) // self.limit

    model_config = ConfigDict(
        arbitrary_types_allowed=True
    )
