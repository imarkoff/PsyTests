import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestsQuery } from './get-psy-tests.query';
import { PsyTest } from 'src/psy-tests/domain/entities/psy-test.entity';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

@QueryHandler(GetPsyTestsQuery)
export class GetPsyTestsHandler implements IQueryHandler<GetPsyTestsQuery> {
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  async execute(): Promise<PsyTest[]> {
    return this.psyTestsEngineGateway.getAllTests();
  }
}
