import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestMarksSystemQuery } from './get-psy-test-marks-system.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

@QueryHandler(GetPsyTestMarksSystemQuery)
export class GetPsyTestsMarksSystemHandler
  implements IQueryHandler<GetPsyTestMarksSystemQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  execute({ testId }: GetPsyTestMarksSystemQuery): Promise<object | [] | null> {
    return this.psyTestsEngineGateway.getTestMarksSystem(testId);
  }
}
