import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestMetadataByIdQuery } from './get-psy-test-metadata-by-id.query';
import { PsyTestDto } from 'src/psy-tests/presentation/dtos/psy-test.dto';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

@QueryHandler(GetPsyTestMetadataByIdQuery)
export class GetPsyTestMetadataByIdHandler
  implements IQueryHandler<GetPsyTestMetadataByIdQuery>
{
  constructor(private readonly gateway: PsyTestsEngineGateway) {}

  execute({ testId }: GetPsyTestMetadataByIdQuery): Promise<PsyTestDto | null> {
    return this.gateway.getTestMetadataById(testId);
  }
}
