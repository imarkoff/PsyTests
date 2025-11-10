import { PsyTestDto } from '../../../presentation/dtos/psy-test.dto';
import { Query } from '@nestjs/cqrs';

export class GetPsyTestsQuery extends Query<PsyTestDto[]> {
  constructor() {
    super();
  }
}
