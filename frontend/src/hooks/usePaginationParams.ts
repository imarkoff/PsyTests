import {useReducer} from "react";
import PaginationParams from "@/types/pagination/PaginationParams";
import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";

/**
 * Custom hook to manage pagination parameters including sorting and filtering.
 *
 * @template TEntity - The type of the data being paginated.
 * @returns An object containing the current pagination parameters and handlers to update them.
 */
export default function usePaginationParams<
    TEntity extends object
>(
    defaultParams?: Partial<PaginationParams<TEntity>>
) {
    const [paginationParams, dispatch] = useReducer(paginationReducer, {
        limit: 25,
        offset: 0,
        sortedFields: [],
        filters: [],
        filterLogicOperator: PaginationLogicalOperator.AND,
        quickFilter: [],
        quickFilterLogicOperator: PaginationLogicalOperator.AND,
        ...defaultParams
    });

    const handlePaginationChange = (page: number, pageSize: number) => {
        dispatch({type: 'SET_PAGINATION', page, pageSize});
    };

    const handleSortedFieldsChange = (sortedFields: PaginationParams<TEntity>['sortedFields']) => {
        dispatch({type: 'SET_SORTED_FIELDS', sortedFields});
    };

    const handleFiltersChange = (
        filters: PaginationParams<TEntity>['filters'],
        filterLogicOperator: PaginationParams<TEntity>['filterLogicOperator']
    ) => {
        dispatch({type: 'SET_FILTERS', filters, filterLogicOperator});
    };

    const handleQuickFilterChange = (
        quickFilter: PaginationParams<TEntity>['quickFilter'],
        quickFilterLogicOperator: PaginationParams<TEntity>['quickFilterLogicOperator']
    ) => {
        dispatch({type: 'SET_QUICK_FILTER', quickFilter, quickFilterLogicOperator});
    };

    return {
        paginationParams,
        handlePaginationChange,
        handleSortedFieldsChange,
        handleFiltersChange,
        handleQuickFilterChange
    };
}

type Action<TEntity extends object> = {
    type: 'SET_PAGINATION';
    page: PaginationParams<TEntity>['offset'];
    pageSize: PaginationParams<TEntity>['limit'];
} | {
    type: 'SET_SORTED_FIELDS';
    sortedFields: PaginationParams<TEntity>['sortedFields'];
} | {
    type: 'SET_FILTERS';
    filters: PaginationParams<TEntity>['filters'];
    filterLogicOperator: PaginationParams<TEntity>['filterLogicOperator'];
} | {
    type: 'SET_QUICK_FILTER';
    quickFilter: PaginationParams<TEntity>['quickFilter'];
    quickFilterLogicOperator: PaginationParams<TEntity>['quickFilterLogicOperator'];
};

const paginationReducer = <
    T extends object
>(
    state: PaginationParams<T>,
    action: Action<T>
): PaginationParams<T> => {
    switch (action.type) {
        case 'SET_PAGINATION':
            return {
                ...state,
                offset: action.page,
                limit: action.pageSize,
            };
        case 'SET_SORTED_FIELDS':
            return {
                ...state,
                sortedFields: action.sortedFields,
            };
        case 'SET_FILTERS':
            return {
                ...state,
                filters: action.filters,
                filterLogicOperator: action.filterLogicOperator,
            };
        case 'SET_QUICK_FILTER':
            return {
                ...state,
                quickFilter: action.quickFilter,
                quickFilterLogicOperator: action.quickFilterLogicOperator,
            };
        default:
            return state;
    }
}