import { SortDirection } from '../enums/sort-direction.enum';
import { FilterOperator } from '../enums/filter-operator.enum';
import { ApiExtraModels, ApiProperty, ApiSchema } from '@nestjs/swagger';
import { SortedFieldDto } from './sorted-field.dto';
import { QuickFiltersDto } from './quick-filters.dto';
import { FiltersDto } from './filters.dto';
import { PaginationParams } from '../types/pagination-params.type';

@ApiSchema({
  description:
    'Parameters for paginating, sorting, and filtering a list of items.',
})
@ApiExtraModels(SortedFieldDto, QuickFiltersDto, FiltersDto)
export class PaginationParamsDto<TModel extends object>
  implements PaginationParams<TModel>
{
  @ApiProperty({
    description: 'The current page number (0-based index).',
    example: 0,
  })
  page: number;

  @ApiProperty({
    description: 'The number of items per page.',
    example: 10,
  })
  pageSize: number;

  @ApiProperty({
    description: 'The fields to sort the results by.',
    example: [{ field: 'name', direction: SortDirection.DESC }],
    type: SortedFieldDto,
    isArray: true,
  })
  sortedFields: SortedFieldDto<TModel>[];

  @ApiProperty({
    description: 'Quick filters to apply to the results.',
    example: {
      filters: ['active', 'verified'],
      operator: FilterOperator.AND,
    },
    type: QuickFiltersDto,
    nullable: true,
  })
  quickFilters: QuickFiltersDto | null;

  @ApiProperty({
    description: 'Detailed filters to apply to the results.',
    example: {
      filters: [
        { field: 'age', operator: 'moreThan', value: 30 },
        { field: 'isActive', operator: 'equals', value: true },
      ],
    },
    type: FiltersDto,
    nullable: true,
  })
  filters: FiltersDto<TModel> | null;
}
