import { ApiProperty } from '@nestjs/swagger';
import { SortDirection } from '../enums/sort-direction.enum';
import { SortedField } from '../types/pagination-params.type';

export class SortedFieldDto<T extends object> implements SortedField<T> {
  @ApiProperty({
    description: 'The field to sort by.',
    example: 'name',
  })
  field: keyof T;

  @ApiProperty({
    description: 'The direction to sort (ascending or descending).',
    example: SortDirection.ASC,
  })
  direction: SortDirection;
}
