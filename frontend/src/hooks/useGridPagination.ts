import usePaginationParams from "@/hooks/usePaginationParams";
import {GridFilterModel, GridLogicOperator, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";
import PaginationFilter from "@/types/pagination/PaginationFilter";
import PaginationParams from "@/types/pagination/PaginationParams";

interface UseGridPaginationReturn<TEntity extends object> {
    paginationParams: PaginationParams<TEntity>;
    paginationModel: GridPaginationModel;
    setPaginationModel: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    setSortModel: (model: GridSortModel) => void;
    filterModel: GridFilterModel;
    setFilterModel: (model: GridFilterModel) => void;
}

/**
 * Extends the usePaginationParams hook
 * to provide MUI Data Grid compatible pagination, sorting,
 * and filtering models and handlers.
 *
 * @template TEntity - The type of the data being paginated.
 * @returns An object containing pagination, sorting,
 *          and filtering models and their respective handlers for MUI Data Grid.
 */
export default function useGridPagination<TEntity extends object>(
    defaultParams?: Partial<PaginationParams<TEntity>>,
): UseGridPaginationReturn<TEntity> {
    const {
        paginationParams,
        handlePaginationChange,
        handleSortedFieldsChange,
        handleFiltersChange,
        handleQuickFilterChange
    } = usePaginationParams<TEntity>(
        defaultParams
    );

    const paginationModel: GridPaginationModel = {
        page: paginationParams.offset,
        pageSize: paginationParams.limit
    };

    const setPaginationModel = (model: GridPaginationModel) => {
        handlePaginationChange(model.page, model.pageSize);
    };

    const sortModel: GridSortModel = paginationParams.sortedFields.map(sort => ({
        field: sort.field,
        sort: sort.direction
    }));

    const setSortModel = (newModel: GridSortModel) => {
        handleSortedFieldsChange(newModel.map(sort => ({
            field: sort.field as keyof TEntity,
            direction: sort.sort as PaginationFieldSortingDirection
        })));
    };

    const filterModel: GridFilterModel = {
        items: paginationParams.filters,
        logicOperator: paginationParams.filterLogicOperator === PaginationLogicalOperator.AND
            ? GridLogicOperator.And : GridLogicOperator.Or,
        quickFilterValues: paginationParams.quickFilter,
    };

    const setFilterModel = (newModel: GridFilterModel) => {
        handleFiltersChange(
            newModel.items.map(item => ({
                ...item,
                field: item.field as keyof TEntity
            })) as PaginationFilter<TEntity, unknown>[],
            newModel.logicOperator === GridLogicOperator.And
                ? PaginationLogicalOperator.AND : PaginationLogicalOperator.OR
        );
        handleQuickFilterChange(
            newModel.quickFilterValues || [],
            newModel.logicOperator === GridLogicOperator.And
                ? PaginationLogicalOperator.AND : PaginationLogicalOperator.OR
        );
    };

    return {
        paginationParams,
        paginationModel,
        setPaginationModel,
        sortModel,
        setSortModel,
        filterModel,
        setFilterModel
    };
}