import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class GetPsyTestMarksSystemQuery extends Query<
  object | string | [] | null
> {
  constructor(public readonly testId: UUID) {
    super();
  }
}
