import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestByIdQuery } from './get-psy-test-by-id.query';
import { PsyTestWithDetails } from 'src/psy-tests/domain/entities/psy-test.entity';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

@QueryHandler(GetPsyTestByIdQuery)
export class GetPsyTestByIdHandler
  implements IQueryHandler<GetPsyTestByIdQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  execute({ testId }: GetPsyTestByIdQuery): Promise<PsyTestWithDetails | null> {
    return this.psyTestsEngineGateway.getTestById(testId);
  }
}
