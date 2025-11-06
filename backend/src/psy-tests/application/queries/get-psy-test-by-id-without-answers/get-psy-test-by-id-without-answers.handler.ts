import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestByIdWithoutAnswersQuery } from './get-psy-test-by-id-without-answers.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestWithDetails } from '../../../domain/entities/psy-test.entity';

@QueryHandler(GetPsyTestByIdWithoutAnswersQuery)
export class GetPsyTestByIdWithoutAnswersHandler
  implements IQueryHandler<GetPsyTestByIdWithoutAnswersQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  execute({
    testId,
  }: GetPsyTestByIdWithoutAnswersQuery): Promise<PsyTestWithDetails | null> {
    return this.psyTestsEngineGateway.getTestByIdWithoutAnswers(testId);
  }
}
