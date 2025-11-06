import { Query } from '@nestjs/cqrs';
import { PsyTestWithDetails } from '../../../domain/entities/psy-test.entity';
import { UUID } from 'node:crypto';

export class GetPsyTestByIdWithoutAnswersQuery extends Query<PsyTestWithDetails | null> {
  constructor(public readonly testId: UUID) {
    super();
  }
}
