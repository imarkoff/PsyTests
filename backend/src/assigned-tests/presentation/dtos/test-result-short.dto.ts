import type { UUID } from 'node:crypto';
import { PsyTestDto } from '../../../psy-tests/presentation/dtos/psy-test.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description:
    "DTO representing a short version of a test result. Typically used for listing on the patient's assigned tests page.",
})
export class TestResultShortDto {
  /** Unique identifier of the test result */
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  /** Date and time when the test was passed */
  @ApiProperty({ type: 'string', format: 'date-time' })
  completedAt: Date;

  /** Information about the test associated with this result */
  @ApiProperty({ type: () => PsyTestDto })
  test: PsyTestDto;
}
