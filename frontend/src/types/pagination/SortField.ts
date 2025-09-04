import PaginationFieldSortingDirection from "@/types/enums/PaginationFieldSortingDirection";

export default interface SortField {
    field: string;
    direction: PaginationFieldSortingDirection;
}