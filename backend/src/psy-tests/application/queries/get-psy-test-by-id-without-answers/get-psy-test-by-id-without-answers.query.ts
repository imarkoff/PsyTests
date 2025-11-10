import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

export class GetPsyTestByIdWithoutAnswersQuery extends Query<PsyTestWithDetailsDto | null> {
  constructor(public readonly testId: UUID) {
    super();
  }
}
