from app.schemas.not_parsed_pagination_params import NotParsedPaginationParams
from app.schemas.pagination import (
    PaginationFilter, PaginationParams,
    SortedField
)
from app.schemas.enums.pagination import SortingDirection


class QueryPaginationParser:
    @classmethod
    def parse(
        cls,
        not_parsed_params: NotParsedPaginationParams
    ) -> PaginationParams:
        """
        Parses the not parsed pagination parameters into a structured format.
        :param not_parsed_params: The not parsed pagination parameters.
        :return: The structured pagination parameters.
        :raises ParseSortDirectionError: if sort direction is invalid
        """
        return PaginationParams(
            limit=not_parsed_params.limit,
            offset=not_parsed_params.offset,
            sorted_fields=cls._parse_sort_fields(
                not_parsed_params.sorted_fields
            ),
            quick_filter=cls._parse_quick_filters(
                not_parsed_params.quick_filter
            ),
            quick_filter_operator=not_parsed_params.quick_filter_operator,
            filters=cls._parse_filters(not_parsed_params.filters),
            filter_logic_operator=not_parsed_params.filter_logic_operator
        )

    @staticmethod
    def _parse_sort_fields(sort_fields: str | None) -> list[SortedField]:
        if sort_fields is None or sort_fields == '':
            return []

        parsed_fields: list[SortedField] = []

        for not_parsed_field in sort_fields.split(" "):
            field, direction = not_parsed_field.split(":")

            parsed_direction = SortingDirection.parse(direction)
            parsed_field = SortedField(field=field, direction=parsed_direction)

            parsed_fields.append(parsed_field)

        return parsed_fields

    @staticmethod
    def _parse_quick_filters(quick_filter: str | None) -> list[str]:
        if not quick_filter:
            return []

        return quick_filter.strip().split(" ")

    @staticmethod
    def _parse_filters(filters: str | None) -> list[PaginationFilter]:
        if not filters:
            return []

        parsed_fields: list[PaginationFilter] = []

        for filter in filters.strip().split(" "):
            field, operator, value = filter.split(":")

            parsed_field = PaginationFilter(
                field=field,
                operator=operator,
                value=value
            )

            parsed_fields.append(parsed_field)

        return parsed_fields
