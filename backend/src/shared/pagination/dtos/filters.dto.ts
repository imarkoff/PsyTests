import { ApiExtraModels, ApiProperty } from '@nestjs/swagger';
import { FilterOperator } from '../enums/filter-operator.enum';
import { FilterField } from './filter-field.dto';
import { Filters } from '../types/pagination-params.type';

@ApiExtraModels(FilterField)
export class FiltersDto<T extends object> implements Filters<T> {
  @ApiProperty({
    description: 'The list of detailed filters to apply.',
    example: [
      { field: 'age', operator: 'moreThan', value: 30 },
      { field: 'isActive', operator: 'equals', value: true },
    ],
    isArray: true,
    type: FilterField,
  })
  filters: FilterField<T>[];

  @ApiProperty({
    description: 'The logical operator to combine the detailed filters.',
    example: FilterOperator.AND,
  })
  operator: FilterOperator;
}
