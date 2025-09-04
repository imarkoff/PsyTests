import PaginationFilterOperator from "@/types/enums/PaginationFilterOperator";

export default interface PaginationFilter<
    TEntity extends object,
    TValue = never
> {
    field: keyof TEntity;
    operator: PaginationFilterOperator;
    value: TValue;
}