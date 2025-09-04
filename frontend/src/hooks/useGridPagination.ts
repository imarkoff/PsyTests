import usePaginationParams from "@/hooks/usePaginationParams";
import {GridFilterModel, GridLogicOperator, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";
import PaginationFilter from "@/types/pagination/PaginationFilter";

export default function useGridPagination<T extends object>() {
    const {
        paginationParams,
        handlePaginationChange,
        handleSortedFieldsChange,
        handleFiltersChange,
        handleQuickFilterChange
    } = usePaginationParams<T>();

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
            field: sort.field,
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
                field: item.field as keyof T
            })) as PaginationFilter<T, never>[],
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