import PaginationParams from "@/types/pagination/PaginationParams";
import {UsePaginationParamsReturn} from "@/hooks/pagination/usePaginationParams";
import {GridPaginationModel} from "@mui/x-data-grid";
import {UseGridPaginationModelReturn} from "./types";

export default function useGridPaginationModel<T extends object>(
    paginationParams: PaginationParams<T>,
    handlePaginationChange: UsePaginationParamsReturn<T>['handlePaginationChange']
): UseGridPaginationModelReturn<T> {
    const paginationModel: GridPaginationModel = {
        page: paginationParams.offset,
        pageSize: paginationParams.limit
    };

    const setPaginationModel = (model: GridPaginationModel) => {
        handlePaginationChange(model.page, model.pageSize);
    };

    return {paginationModel, setPaginationModel};
}