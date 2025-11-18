import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { UUID } from 'node:crypto';
import { Query } from '@nestjs/cqrs';

export class GetPsyTestMetadataByIdOrThrowQuery extends Query<PsyTestDto> {
  constructor(public readonly testId: UUID) {
    super();
  }
}
