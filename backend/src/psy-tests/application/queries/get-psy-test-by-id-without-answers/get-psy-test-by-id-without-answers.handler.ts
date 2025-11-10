import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestByIdWithoutAnswersQuery } from './get-psy-test-by-id-without-answers.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';

@QueryHandler(GetPsyTestByIdWithoutAnswersQuery)
export class GetPsyTestByIdWithoutAnswersHandler
  implements IQueryHandler<GetPsyTestByIdWithoutAnswersQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  execute({
    testId,
  }: GetPsyTestByIdWithoutAnswersQuery): Promise<PsyTestWithDetailsDto | null> {
    return this.psyTestsEngineGateway.getTestByIdWithoutAnswers(testId);
  }
}
