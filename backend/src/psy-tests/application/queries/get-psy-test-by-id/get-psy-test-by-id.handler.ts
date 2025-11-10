import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestByIdQuery } from './get-psy-test-by-id.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

@QueryHandler(GetPsyTestByIdQuery)
export class GetPsyTestByIdHandler
  implements IQueryHandler<GetPsyTestByIdQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  execute({
    testId,
  }: GetPsyTestByIdQuery): Promise<PsyTestWithDetailsDto | null> {
    return this.psyTestsEngineGateway.getTestById(testId);
  }
}
