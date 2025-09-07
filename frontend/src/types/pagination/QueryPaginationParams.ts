import PaginationLogicalOperator from "@/types/enums/PaginationLogicalOperator";

export default interface QueryPaginationParams {
    limit: number;
    offset: number;
    sorted_fields: string | null;
    quick_filter: string | null;
    quick_filter_logic_operator: PaginationLogicalOperator;
    filters: string | null;
    filter_logic_operator: PaginationLogicalOperator;
}