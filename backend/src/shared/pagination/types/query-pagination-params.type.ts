import { FilterOperator } from '../enums/filter-operator.enum';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SortDirection } from '../enums/sort-direction.enum';

@ApiSchema({
  description:
    'Parameters for paginating, sorting, and filtering query results',
})
export class QueryPaginationParams {
  @ApiProperty({
    required: false,
    description: 'Current page number (0-indexed)',
    default: 0,
  })
  page: number = 0;

  @ApiProperty({
    required: false,
    description: 'Number of items per page',
    default: 10,
  })
  pageSize: number = 10;

  @ApiProperty({
    nullable: true,
    required: false,
    description:
      'Fields to sort by, with direction.<br/>' +
      '<i>Format:</i> field:direction;field:direction<br/>' +
      `<i>Directions:</i> ${SortDirection.ASC} for ascending, ${SortDirection.DESC} for descending`,
    example: `name:${SortDirection.ASC};age:${SortDirection.DESC}`,
  })
  sortedFields?: string;

  @ApiProperty({
    nullable: true,
    required: false,
    description: 'Quick filters to apply. Separated by spaces.',
    example: 'John Doe +1234567890',
  })
  quickFilters?: string;

  @ApiProperty({
    description: 'Operator to combine quick filters',
    enum: FilterOperator,
    required: false,
    default: FilterOperator.AND,
  })
  quickFiltersOperator: FilterOperator = FilterOperator.AND;

  @ApiProperty({
    nullable: true,
    required: false,
    description:
      'Advanced filters to apply.<br/>' +
      '<i>Format:</i> field:operator:value;field:operator:value<br/>' +
      '<i>Example operators:</i> equals, contains, onOrAfter, greaterThan, etc.',
    example: 'last_login:onOrAfter:2020-01-01;name:contains:John',
  })
  filters?: string;

  @ApiProperty({
    enum: FilterOperator,
    nullable: true,
    required: false,
    description: 'Operator to combine advanced filters',
    default: FilterOperator.AND,
  })
  filtersOperator: FilterOperator = FilterOperator.AND;
}
