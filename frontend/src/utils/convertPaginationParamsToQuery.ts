import PaginationParams from "@/types/pagination/PaginationParams";
import QueryPaginationParams from "@/types/pagination/QueryPaginationParams";

export default function convertPaginationParamsToQuery<TEntity extends object>(
    params: PaginationParams<TEntity>
): QueryPaginationParams {
    return {
        limit: params.limit,
        offset: params.offset,
        sorted_fields: serializeSortedFields(params.sortedFields),
        quick_filter: serializeQuickFilter(params.quickFilter),
        quick_filter_logic_operator: params.quickFilterLogicOperator,
        filters: serializeFilters(params.filters),
        filter_logic_operator: params.filterLogicOperator
    }
}

// "name:asc age:desc"
function serializeSortedFields<
    TEntity extends object
>(
    sortedFields: PaginationParams<TEntity>['sortedFields']
): string | null {
    if (sortedFields.length === 0) return null;

    return sortedFields
        .map(field => `${String(field.field)}:${field.direction}`)
        .join(' ');
}

// "search terms"
function serializeQuickFilter<
    TEntity extends object
>(
    quickFilter: PaginationParams<TEntity>['quickFilter']
): string | null {
    if (quickFilter.length === 0) return null;

    return quickFilter.join(' ');
}

// "field:operator:value field:operator:value"
function serializeFilters<
    TEntity extends object
>(
    filters: PaginationParams<TEntity>['filters']
): string | null {
    if (filters.length === 0) return null;

    return filters
        .map(filter => `${String(filter.field)}:${filter.operator}:${filter.value}`)
        .join(' ');
}