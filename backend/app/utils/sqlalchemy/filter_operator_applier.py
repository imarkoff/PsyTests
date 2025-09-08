from typing import Any, Callable, Dict
from datetime import datetime
from sqlalchemy import (
    BinaryExpression,
    Column,
    ColumnElement,
    and_,
    or_,
    DateTime
)

from app.schemas.enums.pagination import FilterOperator


class FilterOperatorApplier[T: object]:
    """
    Applies filter operators to SQLAlchemy columns.
    Handles value parsing and validation to ensure safe query building.
    """

    # Operators that do not require a value (e.g., IS_EMPTY)
    NO_VALUE_OPERATORS = {FilterOperator.IS_EMPTY, FilterOperator.IS_NOT_EMPTY}

    @classmethod
    def apply(
        cls,
        operator: FilterOperator,
        column: Column[T],
        value: Any
    ) -> bool | BinaryExpression[bool] | ColumnElement[bool]:
        """
        Apply the filter operator to the given column and value.
        Parses and validates the value before applying the operator.
        If the value is invalid and the operator requires a value,
        skips the filter.

        :param operator: The filter operator to apply.
        :param column: The SQLAlchemy column to apply the operator on.
        :param value: The value to compare the column against.
        :return: The resulting SQLAlchemy expression or True to skip.
        """
        parsed_value = cls._parse_and_validate_value(column, value)

        if parsed_value is None and operator not in cls.NO_VALUE_OPERATORS:
            return True

        clause_func = cls._get_clause_function(operator)
        if clause_func is not None:
            return clause_func(column, parsed_value)
        else:
            return cls._like(column, parsed_value)

    @classmethod
    def _parse_and_validate_value(cls, column: Column[T], value: Any) -> Any:
        """
        Parse and validate the value based on the column type.
        Returns None if the value is invalid or cannot be parsed.

        :param column: The SQLAlchemy column.
        :param value: The raw value.
        :return: Parsed value or None.
        """
        if cls._is_invalid_value(value):
            return None

        if isinstance(column.type, DateTime):
            return cls._parse_datetime_value(value)

        return value

    @staticmethod
    def _is_invalid_value(value: Any) -> bool:
        """Check if the value is considered invalid (e.g., 'undefined')."""
        return (
            value is None
            or value == ""
            or (
                isinstance(value, str)
                and value.lower() in ["undefined", "null"]
            )
        )

    @staticmethod
    def _parse_datetime_value(value: Any) -> datetime | None:
        """Parse a datetime value from string, return None if invalid."""
        if not isinstance(value, str):
            return None  # Non-string values for datetime are invalid
        try:
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
        except ValueError:
            return None

    @classmethod
    def _get_clause_function(
        cls, operator: FilterOperator
    ) -> Callable[[Column[T], Any], Any] | None:
        """Retrieve the clause function for the given operator."""
        return cls._operator_map().get(operator)

    @classmethod
    def _operator_map(
        cls
    ) -> Dict[FilterOperator, Callable[[Column[T], Any], Any]]:
        """Map operators to their corresponding clause functions."""
        return {
            FilterOperator.EQ: cls._equal,
            FilterOperator.NE: cls._not_equal,
            FilterOperator.LT: cls._less_than,
            FilterOperator.GT: cls._greater_than,
            FilterOperator.LE: cls._less_than_or_equal,
            FilterOperator.GE: cls._greater_than_or_equal,
            FilterOperator.LIKE: cls._like,
            FilterOperator.EQUALS: cls._equal,
            FilterOperator.DOES_NOT_EQUAL: cls._not_equal,
            FilterOperator.CONTAINS: cls._contains,
            FilterOperator.DOES_NOT_CONTAIN: cls._does_not_contain,
            FilterOperator.STARTS_WITH: cls._starts_with,
            FilterOperator.ENDS_WITH: cls._ends_with,
            FilterOperator.IS_EMPTY: cls._is_empty,
            FilterOperator.IS_NOT_EMPTY: cls._is_not_empty,
            FilterOperator.IS_ANY_OF: cls._is_any_of,
            FilterOperator.IS: cls._equal,
            FilterOperator.NOT: cls._not_equal,
            FilterOperator.AFTER: cls._greater_than,
            FilterOperator.ON_OR_AFTER: cls._greater_than_or_equal,
            FilterOperator.BEFORE: cls._less_than,
            FilterOperator.ON_OR_BEFORE: cls._less_than_or_equal,
        }

    @staticmethod
    def _equal(column: Column[T], value: Any) -> bool:
        return column == value

    @staticmethod
    def _not_equal(column: Column[T], value: Any) -> bool:
        return column != value

    @staticmethod
    def _less_than(column: Column[T], value: Any) -> bool:
        return column < value

    @staticmethod
    def _greater_than(column: Column[T], value: Any) -> bool:
        return column > value

    @staticmethod
    def _less_than_or_equal(column: Column[T], value: Any) -> bool:
        return column <= value

    @staticmethod
    def _greater_than_or_equal(column: Column[T], value: Any) -> bool:
        return column >= value

    @staticmethod
    def _like(column: Column[T], value: Any) -> BinaryExpression[bool]:
        return column.like(f"%{value}%")

    @staticmethod
    def _contains(column: Column[T], value: Any) -> ColumnElement[bool]:
        return column.ilike(f"%{value}%")

    @staticmethod
    def _does_not_contain(
        column: Column[T],
        value: Any
    ) -> ColumnElement[bool]:
        return ~column.ilike(f"%{value}%")

    @staticmethod
    def _starts_with(column: Column[T], value: Any) -> ColumnElement[bool]:
        return column.like(f"{value}%")

    @staticmethod
    def _ends_with(column: Column[T], value: Any) -> ColumnElement[bool]:
        return column.like(f"%{value}")

    @staticmethod
    def _is_empty(column: Column[T], value: Any = None) -> ColumnElement[bool]:
        return or_(column.is_(None), column == "")

    @staticmethod
    def _is_not_empty(
        column: Column[T],
        value: Any = None
    ) -> ColumnElement[bool]:
        return and_(column.isnot(None), column != "")

    @staticmethod
    def _is_any_of(column: Column[T], value: Any) -> ColumnElement[bool]:
        if isinstance(value, (list, tuple, set)):
            return column.in_(list(value))  # type: ignore
        else:
            return column.in_([value])
