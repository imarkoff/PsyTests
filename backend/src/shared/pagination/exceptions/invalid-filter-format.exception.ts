import { PaginationException } from './pagination.exception';

export class InvalidFilterFormatException extends PaginationException {
  constructor(filterField: string) {
    super(
      `Invalid filter field format: ${filterField}. Expected format is field:operator:value.`,
    );
  }
}
