from typing import Any, Literal
from sqlalchemy import and_, or_
from sqlalchemy.orm import Query
from app.exceptions import IncorrectOperatorError

from app.schemas.pagination import PaginationFilter
from app.schemas.enums.pagination import FilterOperator
from .filter_operator_applier import FilterOperatorApplier


class SQLAlchemyFilterApplier:
    """
    Applies filters to SQLAlchemy queries based on provided filter criteria.
    """

    @classmethod
    def apply[T: object](
        cls,
        model: Any,
        query: Query[T],
        filters: list[PaginationFilter],
        operator: Literal["AND", "OR"],
        fields: list[Any]
    ) -> Query[T]:
        """
        Apply filters to the SQLAlchemy query.

        :param model: The SQLAlchemy model to filter.
        :param query: The SQLAlchemy query to apply filters to.
        :param filters: The list of filters to apply.
        :param operator: The logical operator to use for combining filters.
        :param fields: The list of fields to filter on.

        :raises IncorrectOperatorError:
            If an invalid operator for applying filters is provided.
        :raises IncorrectFilterOperatorError:
            If an invalid filter operator is used inside a filter.
        """

        if not filters:
            return query

        filter_clauses = cls._get_filter_clauses(model, filters)

        if not filter_clauses:
            return query

        query = cls._apply_clauses_according_to_operator(
            query, filter_clauses, operator
        )

        return query

    @staticmethod
    def _get_filter_clauses[T: object](
        model: Any,
        filters: list[PaginationFilter]
    ) -> list[Any]:
        filter_clauses: list[Any] = []

        for filter in filters:
            column = getattr(model, filter.field)
            op = FilterOperator(filter.operator)
            value = filter.value
            clause = FilterOperatorApplier[T].apply(op, column, value)
            filter_clauses.append(clause)

        return filter_clauses

    @staticmethod
    def _apply_clauses_according_to_operator[T: object](
        query: Query[T],
        filter_clauses: list[Any],
        operator: Literal["AND", "OR"]
    ) -> Query[T]:
        if operator == "OR":
            return query.filter(or_(*filter_clauses))
        elif operator == "AND":
            return query.filter(and_(*filter_clauses))

        raise IncorrectOperatorError(f"Invalid operator: {operator}")
