export default interface PaginatedList<T> {
    data: T[];
    limit: number;
    offset: number;
    total: number;
    total_pages: number;
    has_next_page: boolean;
    has_previous_page: boolean;
}