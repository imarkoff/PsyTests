import { TestResultShortDto } from '../../../presentation/dtos/test-result-short.dto';
import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class GetShortTestResultsByPatientIdQuery extends Query<
  TestResultShortDto[]
> {
  constructor(public readonly patientId: UUID) {
    super();
  }
}
