from typing import Any, Literal
from sqlalchemy import and_, or_
from sqlalchemy.orm import Query


class SQLAlchemyQuickFilter:
    @classmethod
    def apply[T: object](
        cls,
        model: Any,
        query: Query[T],
        filters: list[str],
        operator: Literal["AND", "OR"],
        fields: list[Any]
    ) -> Query[T]:
        if not filters:
            return query

        term_filters = [
            cls._get_term_filter(model, term, fields)
            for term in filters
        ]

        combined_filter = cls._apply_operator(term_filters, operator)

        return query.filter(combined_filter)

    @classmethod
    def _get_term_filter(
        cls,
        model: Any,
        term: str,
        fields: list[Any]
    ) -> Any:
        return or_(
            *[
                field.ilike(f"%{term}%")
                if cls._is_string_column(field)
                else field == term
                for field in fields
            ]
        )

    @staticmethod
    def _is_string_column(attr: Any) -> bool:
        return hasattr(attr, 'type') and attr.type.python_type == str

    @staticmethod
    def _apply_operator(
        filters: list[Any],
        operator: Literal["AND", "OR"]
    ) -> Any:
        if operator == "OR":
            return or_(*filters)
        return and_(*filters)
