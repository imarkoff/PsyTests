import { PaginationException } from './pagination.exception';

export class InvalidSortedFieldFormatException extends PaginationException {
  constructor(sortedField: string) {
    super(
      `Invalid sorted field format: ${sortedField}. Expected format is field:direction.`,
    );
  }
}
