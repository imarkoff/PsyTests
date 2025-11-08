import { type UUID } from 'node:crypto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Data Transfer Object representing a psychological test',
})
export class PsyTestDto {
  /** Unique identifier for the psychological test */
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  /** Name of the psychological test */
  @ApiProperty({ example: 'Beck Depression Inventory' })
  name: string;

  /** Type of the psychological test */
  @ApiProperty({ example: 'bdi' })
  type: string;

  /** Description of the psychological test */
  @ApiProperty({
    required: false,
  })
  description: string | null;
}
