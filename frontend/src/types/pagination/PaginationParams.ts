import SortField from "@/types/pagination/SortField";
import PaginationFilter from "@/types/pagination/PaginationFilter";
import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";

export default interface PaginationParams<
    TEntity extends object
> {
    limit: number;
    offset: number;
    sortedFields: SortField<TEntity>[];
    quickFilter: string[];
    quickFilterLogicOperator: PaginationLogicalOperator;
    filters: PaginationFilter<TEntity>[];
    filterLogicOperator: PaginationLogicalOperator;
}