import type { UUID } from 'node:crypto';
import { ApiProperty, ApiSchema } from '@nestjs/swagger';
import { UserDto } from '../../../users/presentation/dtos/user.dto';
import { PsyTestDto } from '../../../psy-tests/presentation/dtos/psy-test.dto';

@ApiSchema({
  description: 'Data Transfer Object representing an assigned test',
})
export class AssignedTestDto {
  /** Unique identifier for the assigned test */
  @ApiProperty({ format: 'uuid' })
  id: UUID;

  /** Unique identifier for the test that has been assigned */
  @ApiProperty({ format: 'uuid' })
  testId: UUID;

  /** The test entity that has been assigned */
  @ApiProperty({ type: () => PsyTestDto })
  test: PsyTestDto | null;

  /** Unique identifier for the patient to whom the test is assigned */
  @ApiProperty({ format: 'uuid' })
  assignedToPatientId: UUID;

  /**
   * The patient user entity to whom the test is assigned.
   * Can be null because of relational loading
   */
  @ApiProperty({ nullable: true, type: () => UserDto })
  assignedToPatient: UserDto | null;

  /** Unique identifier for the doctor who assigned the test */
  @ApiProperty({ format: 'uuid' })
  assignedByDoctorId: UUID;

  /**
   * The doctor user entity who assigned the test.
   * Can be null because of relational loading
   */
  @ApiProperty({ nullable: true, type: () => UserDto })
  assignedByDoctor: UserDto | null;

  /** Timestamp indicating when the test was assigned */
  @ApiProperty({ type: 'string', format: 'date-time' })
  assignedAt: Date;

  /** Timestamp indicating when the test was unassigned, if applicable */
  @ApiProperty({ type: 'string', format: 'date-time', nullable: true })
  unassignedAt: Date | null;
}
