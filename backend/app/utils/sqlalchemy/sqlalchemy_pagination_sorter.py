from sqlalchemy.orm import Query
from typing import Any
from app.schemas.pagination import SortedField
from app.schemas.enums.pagination import SortingDirection


class SQLAlchemyPaginationSorter:
    @staticmethod
    def sort[T: object](
        model: Any,
        query: Query[T],
        fields: list[SortedField]
    ) -> Query[T]:
        mutated_query = query
        for field in fields:
            mutated_query = mutated_query.order_by(
                getattr(model, field.field).asc()
                if field.direction == SortingDirection.ASC
                else getattr(model, field.field).desc()
            )

        return mutated_query
