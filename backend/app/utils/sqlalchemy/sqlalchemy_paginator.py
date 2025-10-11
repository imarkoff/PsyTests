from typing import Any
from sqlalchemy.orm import Query

from app.schemas.pagination import PaginationParams
from app.schemas.pagination import PaginatedList
from .sqlalchemy_pagination_sorter import SQLAlchemyPaginationSorter
from .sqlalchemy_quick_filter import SQLAlchemyQuickFilter
from .sqlalchemy_paginate import SQLAlchemyPaginate
from .sqlalchemy_filter_applier import SQLAlchemyFilterApplier


class SQLAlchemyPaginator:
    """
    A utility class for paginating SQLAlchemy query results.
    """

    @classmethod
    def paginate[T: object](
        cls,
        model: T,
        query: Query[Any],
        pagination_params: PaginationParams,
        joins: list[T] = [],
        filters_fields: list[Any] = []
    ) -> PaginatedList[T]:
        """
        Paginate a SQLAlchemy query
        based on the provided pagination parameters.

        Params:
            model: The SQLAlchemy model class being queried.
            query: The SQLAlchemy query to paginate.
            pagination_params:
                The pagination parameters including
                offset, limit, sorting, and filtering.
            joins:
                List of related models to join in the query.
                This is necessary for filtering and sorting
                on related model fields.
                E.g., [Model.relationship].
            filters_fields:
                List of fields to apply filtering on.
                Can include related model fields, if they are joined
                e.g. "NestedModel.field" (not Model.relationship.field).
                If empty, filters won't be applied.

        Returns:
            A PaginatedList containing the paginated results and metadata.

        Raises:
            IncorrectOperatorError:
                If an invalid operator for applying filters is provided.
            IncorrectFilterOperatorError:
                If an invalid filter operator is used inside a filter.

        Example:
            ```python
            paginated_items = SQLAlchemyPaginator.paginate(
                model=DoctorPatient,
                query=session.query(DoctorPatient),
                pagination_params=pagination_params,
                joins=[DoctorPatient.patient],
                filters_fields=[
                    User.name,        # not DoctorPatient.patient.name
                    User.surname,     # not DoctorPatient.patient.surname
                    User.patronymic,  # not DoctorPatient.patient.patronymic
                    DoctorPatient.needs_attention,
                    DoctorPatient.assigned_at
                ]
            )
            ```
        """

        query = cls._apply_joins(query, joins)

        query = SQLAlchemyPaginationSorter.sort(
            model=model,
            query=query,
            fields=pagination_params.sorted_fields
        )
        query = SQLAlchemyQuickFilter.apply(
            model=model,
            query=query,
            filters=pagination_params.quick_filter,
            operator=pagination_params.quick_filter_operator,
            fields=filters_fields
        )
        query = SQLAlchemyFilterApplier.apply(
            model=model,
            query=query,
            filters=pagination_params.filters,
            operator=pagination_params.filter_logic_operator,
            fields=filters_fields
        )

        total_count = query.count()

        paginated_result = SQLAlchemyPaginate.paginate(
            query=query,
            page=pagination_params.offset,
            per_page=pagination_params.limit
        ).all()

        return PaginatedList(
            data=paginated_result,
            offset=pagination_params.offset,
            limit=pagination_params.limit,
            total=total_count,
            sorted_fields=pagination_params.sorted_fields,
            quick_filter=pagination_params.quick_filter
        )

    @staticmethod
    def _apply_joins[T: object](
        query: Query[T],
        joins: list[Any]
    ) -> Query[T]:
        for join in joins:
            query = query.join(join)
        return query
