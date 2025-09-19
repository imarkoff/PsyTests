import PaginationParams from "@/types/pagination/PaginationParams";
import {UsePaginationParamsReturn} from "@/hooks/pagination/usePaginationParams";
import {GridFilterModel, GridLogicOperator} from "@mui/x-data-grid";
import PaginationFilter from "@/types/pagination/PaginationFilter";
import {UseGridFilterModelReturn} from "./types";
import LogicalOperatorConvertor from "@/utils/LogicalOperatorConvertor";

export default function useGridFilterModel<
    T extends object
>(
    paginationParams: PaginationParams<T>,
    handleFiltersChange: UsePaginationParamsReturn<T>['handleFiltersChange'],
    handleQuickFilterChange: UsePaginationParamsReturn<T>['handleQuickFilterChange']
): UseGridFilterModelReturn<T> {
    const filterModel: GridFilterModel = {
        items: paginationParams.filters as GridFilterModel['items'],
        logicOperator: LogicalOperatorConvertor.toGrid(paginationParams.filterLogicOperator),
        quickFilterValues: paginationParams.quickFilter,
    };

    const setFilterModel = (newModel: GridFilterModel) => {
        handleFiltersChange(
            newModel.items.map(item => ({
                ...item,
                field: item.field as keyof T
            })) as PaginationFilter<T, unknown>[],
            LogicalOperatorConvertor.fromGrid(newModel.logicOperator || GridLogicOperator.And)
        );
        handleQuickFilterChange(
            newModel.quickFilterValues || [],
            LogicalOperatorConvertor.fromGrid(newModel.logicOperator || GridLogicOperator.And)
        );
    };

    return {filterModel, setFilterModel};
}