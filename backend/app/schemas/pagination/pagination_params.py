from typing import Literal
from pydantic import BaseModel

from .pagination_filter import PaginationFilter
from .sorted_field import SortedField


class PaginationParams(BaseModel):
    """Pagination parameters for API responses."""

    limit: int = 10
    """Number of items per page"""

    offset: int = 0
    """Page number starting from 0"""

    sorted_fields: list[SortedField]
    """Sorted fields and directions"""

    quick_filter: list[str] = []
    """Quick search for all fields"""

    quick_filter_operator: Literal["AND", "OR"] = "AND"
    """
    Operator to use for the quick filter.
    AND - all terms must match
    OR - any term must match
    """

    filters: list[PaginationFilter] = []
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
