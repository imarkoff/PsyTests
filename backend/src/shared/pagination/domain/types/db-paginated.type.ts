export interface DbPaginated<T> {
  items: T[];
  totalCount: number;
}
