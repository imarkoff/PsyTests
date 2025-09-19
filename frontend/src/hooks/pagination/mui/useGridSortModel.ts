import {useMemo} from "react";
import {GridSortModel} from "@mui/x-data-grid";
import PaginationParams from "@/types/pagination/PaginationParams";
import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";
import {UsePaginationParamsReturn} from "@/hooks/pagination/usePaginationParams";
import {UseGridSortModelReturn} from "./types";

type GridSortItem = GridSortModel[0];

export default function useGridSortModel<T extends object>(
    paginationParams: PaginationParams<T>,
    handleSortedFieldsChange: UsePaginationParamsReturn<T>['handleSortedFieldsChange']
): UseGridSortModelReturn<T> {
    // useMemo to prevent unnecessary array recreation
    // https://github.com/mui/mui-x/issues/17853#issuecomment-2893601367
    const sortModel: GridSortModel = useMemo(() =>
            paginationParams.sortedFields.map(sort => ({
                field: sort.field,
                sort: sort.direction
            } as GridSortItem))
        , [paginationParams.sortedFields]);

    const setSortModel = (newModel: GridSortModel) => {
        handleSortedFieldsChange(newModel.map(sort => ({
            field: sort.field as keyof T,
            direction: sort.sort as PaginationFieldSortingDirection
        })));
    };

    return {sortModel, setSortModel};
}