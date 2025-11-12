import { ApiProperty } from '@nestjs/swagger';

export class FilterField<T extends object> {
  @ApiProperty({
    description: 'The field to filter by.',
    example: 'age',
  })
  field: keyof T;

  @ApiProperty({
    description: 'The operator to use for filtering.',
    example: 'moreThan',
  })
  operator: string;

  @ApiProperty({
    description: 'The value to filter by.',
    example: 30,
  })
  value: string | number | boolean | null;
}