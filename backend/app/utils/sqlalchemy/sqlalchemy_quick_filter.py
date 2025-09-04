from typing import Any, Literal
from sqlalchemy import and_, or_
from sqlalchemy.orm import Query


class SQLAlchemyQuickFilter:
    @staticmethod
    def apply[T: object](
        model: Any,
        query: Query[T],
        filters: list[str],
        operator: Literal["AND", "OR"],
        fields: list[str]
    ) -> Query[T]:
        if not filters:
            return query

        term_filters = [
            or_(
                *[
                    getattr(model, field).ilike(f"%{term}%")
                    for field in fields
                ]
            )
            for term in filters
        ]

        if operator == "OR":
            combined_filter = or_(*term_filters)
        else:
            combined_filter = and_(*term_filters)

        return query.filter(combined_filter)
