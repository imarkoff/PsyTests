import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestByIdWithoutAnswersQuery } from './get-psy-test-by-id-without-answers.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';
import { PsyTestMapper } from '../../mappers/psy-test.mapper';

@QueryHandler(GetPsyTestByIdWithoutAnswersQuery)
export class GetPsyTestByIdWithoutAnswersHandler
  implements IQueryHandler<GetPsyTestByIdWithoutAnswersQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  async execute({
    testId,
  }: GetPsyTestByIdWithoutAnswersQuery): Promise<PsyTestWithDetailsDto | null> {
    const test =
      await this.psyTestsEngineGateway.getTestByIdWithoutAnswers(testId);
    if (!test) return null;
    return PsyTestMapper.withDetailsToDto(test);
  }
}
