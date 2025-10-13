from sqlalchemy.orm import Query
from typing import Any
from app.schemas.enums.pagination import SortingDirection
from app.schemas.pagination import SortedField
from app.utils.sqlalchemy.nested_attribute_resolver import (
    NestedAttributeResolver
)


class SQLAlchemyPaginationSorter:
    """
    Utility class for sorting SQLAlchemy queries
    based on pagination parameters.
    """

    @classmethod
    def sort[T: object](
        cls,
        model: Any,
        query: Query[T],
        fields: list[SortedField]
    ) -> Query[T]:
        """
        Sort a SQLAlchemy query based on the provided fields.
        :param model: The SQLAlchemy model class.
        :param query: The SQLAlchemy query to sort.
        :param fields: A list of SortedField instances defining the sorting.
        """

        mutated_query = query
        for field in fields:
            nested_attr = NestedAttributeResolver.get_nested_attribute(
                model=model,
                path=field.field
            )
            mutated_query = mutated_query.order_by(
                nested_attr.asc()
                if field.direction == SortingDirection.ASC
                else nested_attr.desc()
            )

        mutated_query = cls._add_tie_breaker(
            model=model,
            query=mutated_query,
            fields=fields
        )

        return mutated_query

    @staticmethod
    def _add_tie_breaker(
        model: Any,
        query: Query[Any],
        fields: list[SortedField]
    ) -> Query[Any]:
        if not any(field.field == 'id' for field in fields):
            query = query.order_by(getattr(model, 'id').asc())
        return query
