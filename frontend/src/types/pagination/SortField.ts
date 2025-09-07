import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";

export default interface SortField<TEntity extends object> {
    field: keyof TEntity;
    direction: PaginationFieldSortingDirection;
}