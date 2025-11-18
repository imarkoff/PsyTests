import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestsQuery } from './get-psy-tests.query';
import { PsyTestDto } from 'src/psy-tests/presentation/dtos/psy-test.dto';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';
import { PsyTestMapper } from '../../mappers/psy-test.mapper';

@QueryHandler(GetPsyTestsQuery)
export class GetPsyTestsHandler implements IQueryHandler<GetPsyTestsQuery> {
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  async execute(): Promise<PsyTestDto[]> {
    const tests = await this.psyTestsEngineGateway.getAllTests();
    return tests.map((t) => PsyTestMapper.toDto(t));
  }
}
