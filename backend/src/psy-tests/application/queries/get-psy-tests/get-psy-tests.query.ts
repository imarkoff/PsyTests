import { PsyTest } from '../../../domain/entities/psy-test.entity';
import { Query } from '@nestjs/cqrs';

export class GetPsyTestsQuery extends Query<PsyTest[]> {
  constructor() {
    super();
  }
}
