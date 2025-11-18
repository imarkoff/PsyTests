import { Command } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';

export class PassAssignedTestCommand extends Command<TestResultShortDto> {
  constructor(
    public readonly testId: UUID,
    public readonly passedByPatientId: UUID,
    public readonly answers: Record<string, any>,
  ) {
    super();
  }
}
