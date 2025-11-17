import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class UnassignTestCommand extends Command<void> {
  constructor(
    public readonly testId: UUID,
    public readonly doctorId: UUID,
    public readonly patientId: UUID,
  ) {
    super();
  }
}
