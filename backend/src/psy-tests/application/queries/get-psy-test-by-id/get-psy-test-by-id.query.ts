import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

export class GetPsyTestByIdQuery extends Query<PsyTestWithDetailsDto | null> {
  constructor(public readonly testId: UUID) {
    super();
  }
}
