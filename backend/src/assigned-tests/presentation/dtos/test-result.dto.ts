import type { UUID } from 'node:crypto';
import { PsyTestDto } from '../../../psy-tests/presentation/dtos/psy-test.dto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';

@ApiSchema({
  description: 'Data Transfer Object representing a psychological test result',
})
export class TestResultDto {
  /** Unique identifier of the test result */
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  /** The psychological test associated with this result */
  @ApiProperty({ type: () => PsyTestDto })
  test: PsyTestDto;

  /** Unique identifier of the patient who completed the test */
  @ApiProperty({ format: 'uuid' })
  completedByPatientId: UUID;

  /** Timestamp when the test was completed */
  @ApiProperty({ type: 'string', format: 'date-time' })
  completedAt: Date;

  /** Data containing the results of the test */
  @ApiProperty({ type: Object })
  resultsData: Record<string, any>;

  /** Optional data containing the verdict of the test */
  @ApiProperty({ type: Object, required: false })
  verdictData?: Record<string, any>;
}
