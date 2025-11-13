import { PaginationException } from './pagination.exception';
import { SortDirection } from '../enums/sort-direction.enum';

export class InvalidSortDirectionException extends PaginationException {
  constructor(direction: string) {
    super(
      `Invalid sort direction: ${direction}. ` +
        `Expected '${SortDirection.ASC}' or '${SortDirection.DESC}'.`,
    );
  }
}
