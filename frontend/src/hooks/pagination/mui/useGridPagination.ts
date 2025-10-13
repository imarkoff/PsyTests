import usePaginationParams from "@/hooks/pagination/usePaginationParams";
import PaginationParams from "@/types/pagination/PaginationParams";
import useGridFilterModel from "@/hooks/pagination/mui/useGridFilterModel";
import {UseGridPaginationReturn} from "@/hooks/pagination/mui/types";
import useGridPaginationModel from "./useGridPaginationModel";
import useGridSortModel from "./useGridSortModel";

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

    const {paginationModel, setPaginationModel} = useGridPaginationModel(
        paginationParams,
        handlePaginationChange
    );

    const {sortModel, setSortModel} = useGridSortModel(
        paginationParams,
        handleSortedFieldsChange
    );

    const {filterModel, setFilterModel} = useGridFilterModel(
        paginationParams,
        handleFiltersChange,
        handleQuickFilterChange
    );

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