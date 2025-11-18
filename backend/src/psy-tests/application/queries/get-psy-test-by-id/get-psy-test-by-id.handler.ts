import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestByIdQuery } from './get-psy-test-by-id.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestWithDetailsDto } from '../../../presentation/dtos/psy-test-with-details.dto';
import { PsyTestMapper } from '../../mappers/psy-test.mapper';

@QueryHandler(GetPsyTestByIdQuery)
export class GetPsyTestByIdHandler
  implements IQueryHandler<GetPsyTestByIdQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  async execute({
    testId,
  }: GetPsyTestByIdQuery): Promise<PsyTestWithDetailsDto | null> {
    const test = await this.psyTestsEngineGateway.getTestById(testId);
    if (!test) return null;
    return PsyTestMapper.withDetailsToDto(test);
  }
}
