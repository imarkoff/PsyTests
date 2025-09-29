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
        query: Query[T],
        pagination_params: PaginationParams,
        filters_fields: list[str] = []
    ) -> PaginatedList[T]:
        """
        Paginate a SQLAlchemy query
        based on the provided pagination parameters.

        Params:
            model: The SQLAlchemy model class.
            query: The SQLAlchemy query to paginate.
            pagination_params:
                The pagination parameters including
                offset, limit, sorting, and filtering.
            filters_fields:
                List of fields to apply filtering on.
                If empty, filters won't be applied.

        Returns:
            A PaginatedList containing the paginated results and metadata.

        Raises:
            IncorrectOperatorError:
                If an invalid operator for applying filters is provided.
            IncorrectFilterOperatorError:
                If an invalid filter operator is used inside a filter.
        """

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
