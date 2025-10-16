from typing import Literal
from pydantic import BaseModel


class NotParsedPaginationParams(BaseModel):
    """
    Parameters that have not been parsed yet.
    Typically, these parameters are received
    from a client request with query strings.
    """

    limit: int = 10
    """Number of items per page"""

    offset: int = 0
    """Page number starting from 0"""

    sorted_fields: str | None = None
    """Sorted fields and direction (e.g name:asc;age:desc)"""

    quick_filter: str | None = None
    """Quick search for all fields. Separated by spaces."""

    quick_filter_operator: Literal["AND", "OR"] = "AND"
    """
    Operator to use for the quick filter.
    AND - all terms must match
    OR - any term must match
    """

    filters: str | None = None
    """
    Additional filters for the query.
    Separated by spaces in the following format:
    field:operator:value;field:operator:value
    Example: last_login:onOrAfter:2020-01-01;name:contains:John
    """

    filter_logic_operator: Literal["AND", "OR"] = "AND"
    """
    Operator to use for the filters.
    AND - all filters must match
    OR - any filter must match
    """
