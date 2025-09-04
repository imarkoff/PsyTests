from typing import Any, Callable, Dict
from sqlalchemy import BinaryExpression, Column, ColumnElement, and_, or_

from app.schemas.pagination import FilterOperator


class FilterOperatorApplier[T: object]:
    """
    Applies filter operators to SQLAlchemy columns.
    """

    @classmethod
    def apply(
        cls,
        operator: FilterOperator,
        column: Column[T],
        value: Any
    ) -> bool | BinaryExpression[bool] | ColumnElement[bool]:
        """
        Apply the filter operator to the given column and value.
        :param operator: The filter operator to apply.
        :param column: The SQLAlchemy column to apply the operator on.
        :param value: The value to compare the column against.
        :return: The resulting SQLAlchemy expression.
        """

        clause_func = cls._operator_map().get(operator)

        if clause_func is not None:
            return clause_func(column, value)
        else:
            return cls._like(column, value)

    @classmethod
    def _operator_map(
        cls
    ) -> Dict[FilterOperator, Callable[[Column[T], Any], Any]]:
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
