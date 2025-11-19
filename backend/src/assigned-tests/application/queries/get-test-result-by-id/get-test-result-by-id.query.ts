import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { TestResultDto } from '../../../presentation/dtos/test-result.dto';

export class GetTestResultByIdQuery extends Query<TestResultDto | null> {
  constructor(public readonly testResultId: UUID) {
    super();
  }
}
