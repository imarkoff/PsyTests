import PaginationParams from "@/types/pagination/PaginationParams";
import {GridFilterModel, GridPaginationModel, GridSortModel} from "@mui/x-data-grid";

export interface UseGridPaginationReturn<TEntity extends object> {
    paginationParams: PaginationParams<TEntity>;
    paginationModel: GridPaginationModel;
    setPaginationModel: (model: GridPaginationModel) => void;
    sortModel: GridSortModel;
    setSortModel: (model: GridSortModel) => void;
    filterModel: GridFilterModel;
    setFilterModel: (model: GridFilterModel) => void;
}

export type UseGridPaginationModelReturn<TEntity extends object> = Pick<
    UseGridPaginationReturn<TEntity>,
    'paginationModel' | 'setPaginationModel'
>;

export type UseGridSortModelReturn<TEntity extends object> = Pick<
    UseGridPaginationReturn<TEntity>,
    'sortModel' | 'setSortModel'
>;

export type UseGridFilterModelReturn<TEntity extends object> = Pick<
    UseGridPaginationReturn<TEntity>,
    'filterModel' | 'setFilterModel'
>;