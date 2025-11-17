import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { UUID } from 'node:crypto';
import { Query } from '@nestjs/cqrs';

export class GetPsyTestMetadataByIdQuery extends Query<PsyTestDto | null> {
  constructor(public readonly testId: UUID) {
    super();
  }
}
