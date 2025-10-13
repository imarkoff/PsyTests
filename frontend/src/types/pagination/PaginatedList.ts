import PaginationParams from "@/types/pagination/PaginationParams";

export default interface PaginatedList<
    T extends object
> extends PaginationParams<T> {
    data: T[];
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
}