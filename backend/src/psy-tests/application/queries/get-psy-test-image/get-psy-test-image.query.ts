import { Query } from '@nestjs/cqrs';
import { UUID } from 'node:crypto';

export class GetPsyTestImageQuery extends Query<Buffer | null> {
  constructor(
    public readonly testId: UUID,
    public readonly imagePath: string,
  ) {
    super();
  }
}
