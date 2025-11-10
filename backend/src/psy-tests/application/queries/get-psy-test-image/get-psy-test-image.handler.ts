import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetPsyTestImageQuery } from './get-psy-test-image.query';
import { PsyTestsEngineGateway } from '../../../domain/interfaces/psy-tests-engine.gateway';

@QueryHandler(GetPsyTestImageQuery)
export class GetPsyTestImageHandler
  implements IQueryHandler<GetPsyTestImageQuery>
{
  constructor(private readonly psyTestsEngineGateway: PsyTestsEngineGateway) {}

  execute({ testId, imagePath }: GetPsyTestImageQuery): Promise<Buffer | null> {
    return this.psyTestsEngineGateway.getTestImage(testId, imagePath);
  }
}
