import PaginationFilterOperator from "@/types/enums/PaginationFilterOperator";

export default interface PaginationFilter<
    TEntity extends object,
    TValue = unknown
> {
    field: keyof TEntity;
    operator: PaginationFilterOperator;
    value: TValue;
}