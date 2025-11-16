import { ApiProperty } from '@nestjs/swagger';
import { FilterOperator } from '../../domain/enums/filter-operator.enum';
import { QuickFilters } from '../../domain/types/pagination-params.type';

export class QuickFiltersDto implements QuickFilters {
  @ApiProperty({
    description: 'The list of quick filter identifiers to apply.',
    example: ['active', 'verified'],
    isArray: true,
  })
  filters: string[];

  @ApiProperty({
    description: 'The logical operator to combine the quick filters.',
    example: FilterOperator.AND,
  })
  operator: FilterOperator;
}
